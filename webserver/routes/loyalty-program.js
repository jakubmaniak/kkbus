const express = require('express');
const router = express.Router();
const { invalidRequest, invalidValue, notEnough, outOfStock, limitReached } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole, roles, onlyRoles } = require('../middlewares/roles');
const { parseDateTime } = require('../helpers/date');

const rewardController = require('../controllers/reward');
const rewardOrderController = require('../controllers/reward-order');
const userController = require('../controllers/user');


router.get('/loyalty-program', async (req, res, next) => {
    let { id: userId, role } = req.user;
    
    let points = 0;

    if (role == roles.client) {
        try {
            points = await userController.findUserPoints(userId);
        }
        catch (err) {
            return next(err);
        }
    }

    res.ok({
        points,
        rewards: await rewardController.findAllRewards()
    });
});

router.get('/loyalty-program/rewards', async (req, res, next) => {
    res.ok(await rewardController.findAllRewards());
});

router.get('/loyalty-program/orders', [onlyRoles('client')], async (req, res, next) => {
    try {
        let orders = await rewardOrderController.findUserOrders(req.user.id);
        res.ok(orders);
    }
    catch (err) {
        return next(err);
    }
});

router.post('/loyalty-program/order/:rewardId', [onlyRoles('client')], async (req, res, next) => {
    let rewardId = parseInt(req.params.rewardId, 10);
    if (isNaN(rewardId)) return next(invalidRequest());

    let { id: userId } = req.user;

    try {        
        let [reward, userPoints] = await Promise.all([
            rewardController.findReward(rewardId),
            userController.findUserPoints(userId)
        ]);

        if (reward.amount == 0) throw outOfStock();
        if (userPoints < reward.requiredPoints) throw notEnough();

        if (reward.limit !== null) {
            let orderCount = await rewardOrderController.countUserOrders(userId, rewardId);
            if (orderCount > reward.limit) throw limitReached();
        }

        let updateReward = null;
        if (reward.amount !== null) {
            updateReward = rewardController.updateReward(rewardId, {
                ...reward,
                amount: reward.amount - 1
            });
        }

        await Promise.all([
            rewardOrderController.addOrder({
                rewardId,
                userId,
                points: reward.requiredPoints,
                orderDate: parseDateTime(new Date()).toString()
            }),
            userController.updateUserPoints(userId, userPoints - reward.requiredPoints),
            updateReward
        ]);

        res.ok({ points: userPoints });
    }
    catch (err) {
        return next(err);
    }
});

router.post('/loyalty-program/reward', [
    minimumRole('owner'),
    bodySchema(`{
        name: string,
        requiredPoints: number,
        amount?: number,
        limit?: number
    }`)
], async (req, res, next) => {
    let { name, requiredPoints, amount, limit } = req.body;

    if ((amount != null && amount < 0) || (limit != null && limit < 0)) {
        return next(invalidValue());
    }

    try {
        let result = await rewardController.addReward({
            name,
            requiredPoints,
            amount,
            limit
        });

        res.ok({ id: result.insertId });
    }
    catch {
        return next(serverError());
    }
});

router.put('/loyalty-program/reward/:rewardId', [
    minimumRole('owner'),
    bodySchema(`{
        name: string,
        requiredPoints: number,
        amount?: number,
        limit?: number
    }`)
], async (req, res, next) => {
    let rewardId = parseInt(req.params.rewardId, 10);
    if (isNaN(rewardId)) {
        return next(invalidRequest());
    }

    let { name, requiredPoints, amount, limit } = req.body;
    if ((amount != null && amount < 0) || (limit != null && limit < 0)) {
        return next(invalidValue());
    }

    let updatedReward = {
        name,
        requiredPoints,
        amount,
        limit
    };

    try {
        await rewardController.updateReward(rewardId, updatedReward);
    }
    catch (err) {
        return next(err);
    }

    res.ok({ id: rewardId, ...updatedReward });
});

router.delete('/loyalty-program/reward/:rewardId', [minimumRole('owner')], async (req, res, next) => {
    let rewardId = parseInt(req.params.rewardId, 10);
    if (isNaN(rewardId)) {
        return next(invalidRequest());
    }

    try {
        await rewardController.deleteReward(rewardId);
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

module.exports = router;
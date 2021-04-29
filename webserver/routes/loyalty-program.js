const express = require('express');
const router = express.Router();
const { invalidRequest, notFound, invalidValue } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole, roles } = require('../middlewares/roles');

const rewardController = require('../controllers/reward');

const userPoints = new Map([
    ['annanowak1234', 1000000]
]);


router.get('/loyalty-program', async (req, res, next) => {
    let { login, role } = req.user;
    
    let points = 0;

    if (role == roles.client) {
        points = userPoints.get(login);
    }

    res.ok({
        points,
        rewards: await rewardController.findAllRewards()
    });
});

router.get('/loyalty-program/rewards', async (req, res, next) => {
    res.ok(await rewardController.findAllRewards());
});

router.get('/loyalty-program/reward/:rewardId', [minimumRole('client')], async (req, res, next) => {
    let rewardId = parseInt(req.params.rewardId, 10);
    if (isNaN(rewardId)) return next(invalidRequest());

    let { login } = req.user;

    let reward;
    try {
        reward = await rewardController.findReward(rewardId);
    }
    catch (err) {
        return next(err);
    }

    if (!userPoints.has(login)) return next(invalidRequest());
    let points = userPoints.get(login);
    if (points < reward.requiredPoints) return next(invalidRequest());

    points -= reward.requiredPoints;
    userPoints.set(login, points);

    res.ok({ points });
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

    if (amount < 0 || limit < 0) {
        return next(invalidValue());
    }

    try {
        let result = await rewardController.addReward({
            name,
            requiredPoints,
            amount: amount ?? 0,
            limit: limit ?? 0
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
        amount: number,
        limit: number
    }`)
], async (req, res, next) => {
    let rewardId = parseInt(req.params.rewardId, 10);
    if (isNaN(rewardId)) {
        return next(invalidRequest());
    }

    let { name, requiredPoints, amount, limit } = req.body;
    if (amount < 0 || limit < 0) {
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
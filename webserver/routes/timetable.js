const express = require('express');
const router = express.Router();

const { invalidRequest, notFound, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);

const timetableController = require('../controllers/timetable');
const userController = require('../controllers/user');


router.get('/timetable', [role('driver')], async (req, res, next) => {
    try {
        res.ok(await timetableController.findAllAvailabilities());
    }
    catch {
        next(serverError());
    }
});

router.post('/timetable', [
    role('driver'),
    bodySchema(`{
        available: boolean,
        label?: string,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let { available, label, startDate, days, ranges } = req.body;

    let result;
    try {
        result = await timetableController.addAvailability({
            userId: req.user.id,
            available,
            label,
            startDate,
            days,
            ranges
        });
    }
    catch (err) {
        if (err.code == 'ER_DATA_TOO_LONG') {
            return next(invalidRequest());
        }
        return next(serverError());
    }

    res.ok({ id: result.insertId });
});

router.post('/timetable/:userId', [
    role('office'),
    bodySchema(`{
        available: boolean,
        label?: string,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let { available, label, startDate, days, ranges } = req.body;
    
    let userId = parseInt(req.params.userId);
    if (isNaN(userId)) return next(invalidRequest());

    try {
        await userController.findUserById(userId);
    }
    catch (err) {
        return next(err);
    }

    let result;
    try {
        result = await timetableController.addAvailability({
            userId,
            available,
            label,
            startDate,
            days,
            ranges
        });
    }
    catch (err) {
        if (err.code == 'ER_DATA_TOO_LONG') {
            return next(invalidRequest());
        }
        return next(serverError());
    }

    res.ok({ id: result.insertId });
});

router.put('/timetable/:itemId', [
    role('driver'),
    bodySchema(`{
        available: boolean,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], (req, res) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) throw invalidRequest();

    let { available, label, startDate, days, ranges } = req.body;

    let targetEmployee = null;
    let itemIndex;

    for (let employee of timetable) {
        itemIndex = employee.items.findIndex(({ id }) => id == wantedId);
        
        if (itemIndex >= 0) {
            targetEmployee = employee;
            break;
        }
    }

    if (targetEmployee == null) {
        return next(notFound());
    }
    
    let updatedItem = { id: wantedId, available, label, startDate, days, ranges };
    targetEmployee.items[itemIndex] = updatedItem;

    res.ok(updatedItem);
});

router.delete('/timetable/:itemId', [role('driver')], async (req, res, next) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) throw invalidRequest();

    let targetEmployee = null;
    let itemIndex;

    for (let employee of timetable) {
        itemIndex = employee.items.findIndex(({ id }) => id == wantedId);
        
        if (itemIndex >= 0) {
            targetEmployee = employee;
            break;
        }
    }

    if (targetEmployee == null) {
        next(notFound());
    }
    else {
        targetEmployee.items.splice(itemIndex, 1);

        if (targetEmployee.items.length == 0) {
            timetable.splice(timetable.indexOf(targetEmployee), 1);
        }

        res.ok();
    }
});


module.exports = router;
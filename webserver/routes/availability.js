const express = require('express');
const router = express.Router();
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');
const { parseDate, parseTime, parseDateTime } = require('../helpers/date');
const { resolveRoles } = require('../helpers/query-utils');
const { invalidValue } = require('../errors');

const availabilityController = require('../controllers/availability');


router.get('/availability', [minimumRole('driver')], async (req, res, next) => {
    try {
        let today = parseDate(new Date());
        let entities = await availabilityController.findManyEntitiesByDate(today)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.get('/availability/:date', [minimumRole('driver')], async (req, res, next) => {
    try {
        let date = parseDate(req.params.date);
        let entities = await availabilityController.findManyEntitiesByDate(date)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.get('/availability/:startDate/:endDate', [minimumRole('driver')], async (req, res, next) => {
    try {
        let startDate = parseDate(req.params.startDate);
        let endDate = parseDate(req.params.endDate);
        let entities = await availabilityController.findManyEntitiesByDateRange(startDate, endDate)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.post('/availability', [
    minimumRole('driver'),
    bodySchema(`{
        employeeId: number,
        date: string,
        startHour: string,
        endHour: string,
        label: string,
        available: boolean
    }`)
], async (req, res, next) => {
    let { employeeId, date, startHour, endHour, label, available } = req.body;

    try {
        let result = await availabilityController.addEntity({
            employeeId,
            date,
            startHour,
            endHour,
            label,
            available
        });
        res.ok({ id: result.insertId });
    }
    catch (err) {
        next(err);
    }
});

router.patch('/availability/:entityId', [
    minimumRole('driver'),
    bodySchema(`{
        employeeId?: number,
        startHour?: string,
        endHour?: string,
        label?: string,
        available?: boolean
    }`)
], async (req, res, next) => {
    let entityId = parseInt(req.params.entityId, 10);
    
    if (isNaN(entityId)) {
        return next(invalidValue());
    }

    let { employeeId, startHour, endHour, label, available } = req.body;

    try {
        startHour = parseTime(startHour);
        endHour = parseTime(endHour);

        await availabilityController.updateEntity(entityId, {
            employeeId,
            startHour,
            endHour,
            label,
            available
        });
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

router.delete('/availability/:entityId', [minimumRole('driver')], async (req, res, next) => {
    let entityId = parseInt(req.params.entityId, 10);
    
    if (isNaN(entityId)) {
        return next(invalidValue());
    }

    try {
        await availabilityController.deleteEntity(entityId);
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
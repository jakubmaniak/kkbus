const express = require('express');
const router = express.Router();
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');
const { parseDate, parseTime, parseDateTime } = require('../helpers/date');
const { resolveRoles } = require('../helpers/query-utils');
const { invalidValue } = require('../errors');

const workScheduleController = require('../controllers/work-schedule');


router.get('/work-schedule', [minimumRole('driver')], async (req, res, next) => {
    try {
        let today = parseDate(new Date());
        let entities = await workScheduleController.findManyEntitiesByDate(today)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.get('/work-schedule/:date', [minimumRole('driver')], async (req, res, next) => {
    try {
        let date = parseDate(req.params.date);
        let entities = await workScheduleController.findManyEntitiesByDate(date)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.get('/work-schedule/:startDate/:endDate', [minimumRole('driver')], async (req, res, next) => {
    try {
        let startDate = parseDate(req.params.startDate);
        let endDate = parseDate(req.params.endDate);
        let entities = await workScheduleController.findManyEntitiesByDateRange(startDate, endDate)
            .then(resolveRoles('role'));
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.post('/work-schedule', [
    minimumRole('office'),
    bodySchema(`{
        employeeId: number,
        date: string,
        startHour: string,
        endHour: string,
        label: string,
        vehicleId?: number,
        routeId?: number,
        parking?: string
    }`)
], async (req, res, next) => {
    let { employeeId, date, startHour, endHour, label, vehicleId, routeId, parking } = req.body;

    try {
        let result = await workScheduleController.addEntity({
            employeeId,
            date,
            startHour,
            endHour,
            label,
            vehicleId,
            routeId,
            parking
        });
        res.ok({ id: result.insertId });
    }
    catch (err) {
        next(err);
    }
});

router.patch('/work-schedule/:entityId', [
    minimumRole('office'),
    bodySchema(`{
        employeeId?: number,
        startHour?: string,
        endHour?: string,
        label?: string,
        routeId?: number,
        vehicleId?: number,
        parking?: string
    }`)
], async (req, res, next) => {
    let entityId = parseInt(req.params.entityId, 10);
    
    if (isNaN(entityId)) {
        return next(invalidValue());
    }

    let { employeeId, startHour, endHour, label, routeId, vehicleId, parking } = req.body;

    try {
        startHour = parseTime(startHour);
        endHour = parseTime(endHour);

        await workScheduleController.updateEntity(entityId, {
            employeeId,
            startHour,
            endHour,
            label,
            routeId,
            vehicleId,
            parking
        });
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

router.delete('/work-schedule/:entityId', [minimumRole('office')], async (req, res, next) => {
    let entityId = parseInt(req.params.entityId, 10);
    
    if (isNaN(entityId)) {
        return next(invalidValue());
    }

    try {
        await workScheduleController.deleteEntity(entityId);
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
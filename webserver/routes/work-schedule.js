const express = require('express');
const router = express.Router();
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');
const { parseDate, parseTime, parseDateTime } = require('../helpers/date');
const { invalidValue } = require('../errors');

const workScheduleController = require('../controllers/work-schedule');


router.get('/work-schedule', [minimumRole('driver')], async (req, res, next) => {
    try {
        let today = parseDate(new Date());
        let entities = await workScheduleController.findManyEntitiesByDate(today);
        res.ok(entities);
    }
    catch (err) {
        next(err);
    }
});

router.get('/work-schedule/:date', [minimumRole('driver')], async (req, res, next) => {
    try {
        let date = parseDate(req.params.date);
        let entities = await workScheduleController.findManyEntitiesByDate(date);
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
        vehicleId?: number
    }`)
], async (req, res, next) => {
    let { employeeId, date, startHour, endHour, label, vehicleId } = req.body;

    try {
        let result = await workScheduleController.addEntity({
            employeeId,
            date,
            startHour,
            endHour,
            label,
            vehicleId
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
        startHour?: string,
        endHour?: string,
        label?: string
    }`)
], async (req, res, next) => {
    let entityId = parseInt(req.params.entityId, 10);
    
    if (isNaN(entityId)) {
        return next(invalidValue());
    }

    let { startHour, endHour, label } = req.body;

    try {
        await workScheduleController.updateEntity(entityId, {
            startHour,
            endHour,
            label
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
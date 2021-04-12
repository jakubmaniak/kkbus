const express = require('express');
const router = express.Router();

const { invalidRequest, notFound, serverError, unauthorized } = require('../errors');
const { parseDate } = require('../helpers/date');
const bodySchema = require('../middlewares/body-schema');
const { roles, minimumRole } = require('../middlewares/roles');

const timetableController = require('../controllers/timetable');
const userController = require('../controllers/user');


router.get('/timetable', [minimumRole('driver')], async (req, res, next) => {
    try {
        res.ok(await timetableController.findAllAvailabilities());
    }
    catch {
        next(serverError());
    }
});

router.get('/timetable/:date', [minimumRole('driver')], async (req, res, next) => {
    let date = parseDate(req.params.date);
    if (!date) return next(invalidRequest());

    try {
        res.ok(await timetableController.findAllAvailabilities(date));
    }
    catch {
        next(serverError());
    }
});

router.post('/timetable', [
    minimumRole('driver'),
    bodySchema(`{
        available: boolean,
        label?: string,
        startDate: string,
        days?: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let { available, label, startDate, days, ranges } = req.body;
    ranges = ranges.map((range) => range.trim());

    if (days == null) {
        days = 1;
    }

    days = parseInt(days);
    if (isNaN(days) || days <= 0) return next(invalidRequest());

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
    minimumRole('office'),
    bodySchema(`{
        available: boolean,
        label?: string,
        startDate: string,
        days?: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let { available, label, startDate, days, ranges } = req.body;
    ranges = ranges.map((range) => range.trim());
    
    if (days == null) {
        days = 1;
    }

    days = parseInt(days);
    if (isNaN(days) || days <= 0) return next(invalidRequest());

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
    minimumRole('driver'),
    bodySchema(`{
        available: boolean,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) return next(invalidRequest());

    let { available, label, startDate, days, ranges } = req.body;
    ranges = ranges.map((range) => range.trim());

    let availability;
    try {
        availability = await timetableController.findAvailability(wantedId);
    }
    catch (err) {
        return next(err);
    }

    if (availability.userId != req.user.id && req.user.role != roles.office && req.user.role != roles.owner) {
        return next(unauthorized());
    }

    try {
        await timetableController.updateAvailability(wantedId, {
            available,
            label,
            startDate,
            days,
            ranges
        });
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

router.delete('/timetable/:itemId', [minimumRole('driver')], async (req, res, next) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) return next(invalidRequest());

    let availability;
    try {
        availability = await timetableController.findAvailability(wantedId);
    }
    catch (err) {
        return next(err);
    }

    if (availability.userId != req.user.id && req.user.role != roles.office && req.user.role != roles.owner) {
        return next(unauthorized());
    }

    try {
        await timetableController.deleteAvailability(wantedId);
        res.ok();
    }
    catch {
        next(serverError());
    }
});


module.exports = router;
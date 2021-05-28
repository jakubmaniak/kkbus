const express = require('express');
const router = express.Router();
const { invalidValue } = require('../errors');
const { minimumRole } = require('../middlewares/roles');
const bodySchema = require('../middlewares/body-schema');

const bookingReportController = require('../controllers/booking-report');

router.get('/booking-reports/:year', [minimumRole('office')], async (req, res, next) => {
    let year = parseInt(req.params.year, 10);

    if (isNaN(year)) {
        return next(invalidValue());
    }

    try {
        let report = await bookingReportController.findManyBookingReportsByYear(year);
        res.ok(report);
    }
    catch (err) {
        next(err);
    }
});

router.get('/booking-report/:year', [minimumRole('office')], async (req, res, next) => {
    let year = parseInt(req.params.year, 10);

    if (isNaN(year)) {
        return next(invalidValue());
    }

    try {
        let report = await bookingReportController.groupBookingReportsByYear(year);
        res.ok(report);
    }
    catch (err) {
        next(err);
    }
});

router.get('/booking-report/:year/:month', [minimumRole('office')], async (req, res, next) => {
    let year = parseInt(req.params.year, 10);
    let month = parseInt(req.params.month, 10);

    if (isNaN(year) || isNaN(month)) {
        return next(invalidValue());
    }

    try {
        let report = await bookingReportController.findBookingReportByMonth(year, month);
        res.ok(report);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
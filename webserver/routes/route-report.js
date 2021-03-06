const express = require('express');
const router = express.Router();

const { invalidValue } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { roles, onlyRoles, roleDictionary } = require('../middlewares/roles');
const { parseDateTime, parseDate } = require('../helpers/date');

const routeReportController = require('../controllers/route-report');
const bookingController = require('../controllers/booking');
const vehicleController = require('../controllers/vehicle');
const routeController = require('../controllers/route');
const userController = require('../controllers/user');
const bookingReportController = require('../controllers/booking-report');
const refuelController = require('../controllers/refuel');

router.post('/reports/route/:routeId', [
    onlyRoles('driver', 'owner'),
    bodySchema(`{
        stop: string,
        vehicleId: number,
        driverId?: number,
        noBookingPersons?: number,
        bookings?: object[]
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);
    if (isNaN(routeId)) return next(invalidValue());

    let driverId;
    if (req.user.role == roles.driver) {
        driverId = req.user.id;
    }
    else {
        driverId = req.body.driverId;
    }

    let { stop, vehicleId, noBookingPersons, bookings } = req.body;
    noBookingPersons ??= 0;
    bookings ??= [];

    for (let booking of bookings) {
        if (!Number.isInteger(booking.id) || typeof booking.realized !== 'boolean') {
            throw invalidValue();
        }
    }

    try {
        let [route, ] = await Promise.all([
            routeController.findRoute(routeId),
            vehicleController.findVehicle(vehicleId)
        ]);
        
        if (req.user.role == roles.owner) {
            let user = await userController.findUserById(driverId);

            if (roleDictionary.getRole(user.role) !== roles.driver) {
                throw invalidValue();
            }
        }

        if (!route.stops.includes(stop)) {
            throw invalidValue();
        }

        let persons = noBookingPersons;
        let income = 0;

        if (bookings.length > 0) {
            let realizedIds = bookings.filter((booking) => booking.realized).map((booking) => booking.id);
            let unrealizedIds = bookings.filter((booking) => !booking.realized).map((booking) => booking.id);

            let promises = [];

            let year = new Date().getFullYear();
            let month = new Date().getMonth() + 1;
            try {
                let bookingReport = await bookingReportController.findBookingReportByMonth(year, month);
                bookingReport.realizedCount += realizedIds.length;
                bookingReport.unrealizedCount += unrealizedIds.length;
                promises.push(bookingReportController.updateBookingReport(bookingReport.id, bookingReport));
            }
            catch (err) {
                if (err.message == 'not_found') {
                    promises.push(bookingReportController.addBookingReport({
                        year,
                        month,
                        realizedCount: realizedIds.length,
                        unrealizedCount: unrealizedIds.length
                    }));
                }
                else {
                    return next(err);
                }
            }

            if (realizedIds.length > 0) {
                let bookings = await bookingController.findManyBookings(realizedIds);

                for (let booking of bookings) {
                    income += booking.price * 100;
                    persons += booking.normalTickets + booking.reducedTickets + booking.childTickets;

                    let startIndex = route.stops.findIndex((stop) => stop === booking.firstStop);
                    let endIndex = route.stops.findIndex((stop) => stop === booking.lastStop);

                    if (startIndex == -1 || endIndex == -1) continue;

                    let points = route.distances.slice(startIndex, endIndex).reduce((a, b) => a + b, 0);
                    let updatePoints = userController.increaseUserPoints(booking.userId, Math.round(points));

                    promises.push(updatePoints);
                }
            }

            if (unrealizedIds.length > 0) {
                let expirationDate = new Date();
                let currentMonth = expirationDate.getMonth();

                if (currentMonth == 11) {
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                    expirationDate.setMonth(0);
                }
                else {
                    expirationDate.setMonth(currentMonth + 1);
                }
                expirationDate = parseDate(expirationDate);

                let addBookLocks = (async () => {
                    await userController.useBookingsIdsToSetUnrealizedBookingsCounter(unrealizedIds);
                    await userController.addManyBookLocksUsingBookingIds(unrealizedIds, expirationDate, 3);
                })();

                promises.push(addBookLocks);
            }

            await Promise.all(promises);
        }

        let result = await routeReportController.addReport({
            routeId,
            stop,
            vehicleId,
            driverId,
            date: parseDateTime(new Date()).toString(3),
            persons,
            income
        });

        res.ok({ id: result.insertId });
    }
    catch (err) {
        next(err);
    }
});

router.get('/reports/route/:routeId/:vehicleId/:driverId/:type/:range', [
    onlyRoles('office', 'owner')
], async (req, res, next) => {
    let { routeId, vehicleId, driverId, type, range } = req.params;
    
    type = type.toLowerCase();
    routeId = parseInt(routeId, 10);
    vehicleId = parseInt(vehicleId, 10);
    driverId = parseInt(driverId, 10);

    if (isNaN(routeId) || isNaN(vehicleId) || isNaN(driverId)) {
        return next(invalidValue());
    }

    let route, vehicle, fuelReports;
    let reports = [];

    try {
        route = await routeController.findRoute(routeId);
        vehicle = await vehicleController.findVehicle(vehicleId);

        if (type == 'daily') {
            let date = parseDate(range);
            reports = await routeReportController.findDailyReports(routeId, vehicleId, driverId, date);
        }
        else if (type == 'weekly') {
            let parts = range.split('-');

            if (parts.length  != 2) {
                throw invalidValue();
            }

            let [year, week] = parts;
            year = parseInt(year, 10);
            week = parseInt(week.slice(1), 10);

            if (isNaN(year) || isNaN(week)) {
                throw invalidValue();
            }

            reports = await routeReportController.findWeeklyReports(routeId, vehicleId, driverId, year, week);
        }
        else if (type == 'monthly') {
            let parts = range.split('-');

            if (parts.length != 2) {
                throw invalidValue();
            }

            let [year, month] = parts.map((part) => parseInt(part, 10));

            if (isNaN(year) || isNaN(month)) {
                throw invalidValue();
            }

            reports = await routeReportController.findMonthlyReports(routeId, vehicleId, driverId, year, month);
        }
        else if (type == 'annual') {
            let year = parseInt(range, 10);

            if (isNaN(year)) {
                throw invalidValue();
            }

            reports = await routeReportController.findAnnualReports(routeId, vehicleId, driverId, year);
        }
        else {
            throw invalidValue();
        }

        fuelReports = await refuelController.findAllRefuels();
    }
    catch (err) {
        return next(err);
    }

    let findFuelCost = (date) => {
        let dateTimestamp = new Date(date).getTime();
        let diffs = fuelReports.map((report) => new Date(report.date) - dateTimestamp);
        let closestValue = Infinity;
        let closestIndex = 0;

        for (let i = 0; i < diffs.length; i++) {
            let absValue = Math.abs(diffs[i]);
            
            if (absValue < closestValue) {
                closestValue = absValue;
                closestIndex = i;
            }
        }

        let closestReport = fuelReports[closestIndex];
        return closestReport.cost / closestReport.amount;
    };

    let result = [];

    for (let stopName of route.stops) {
        let stopReports = reports.filter((report) => report.stop == stopName);
        let stopPersons = stopReports.reduce((counter, report) => counter += report.persons, 0);
        let stopIncome = stopReports.reduce((counter, report) => counter += report.income, 0);

        let stopIndex = route.stops.findIndex((stop) => stop === stopName);
        
        let usedFuelCost = 0;

        if (stopIndex > 0) {
            let distance = route.distances.slice(0, stopIndex).reduce((a, b) => a + b, 0);
            let usedFuelAmount = vehicle.combustion / 100 * distance;
            usedFuelCost = usedFuelAmount * findFuelCost(new Date());
        }

        result.push({ stop: stopName, persons: stopPersons, income: stopIncome / 100, usedFuelCost });
    }

    res.ok(result);
});

module.exports = router;
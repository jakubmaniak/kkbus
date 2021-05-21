const express = require('express');
const router = express.Router();
const { invalidRequest, unauthorized, serverError, tooLate, bookingLocked, notFound } = require('../errors');
const { minimumRole, onlyRoles, roles, roleDictionary } = require('../middlewares/roles');
const bodySchema = require('../middlewares/body-schema');

const bookingController = require('../controllers/booking');
const routeController = require('../controllers/route');
const userController = require('../controllers/user');
const { parseDate, parseTime, parseDateTime } = require('../helpers/date');


function validateTicketNumbers(normalTickets, reducedTickets, childTickets) {
    normalTickets = parseInt(normalTickets, 10);
    if (isNaN(normalTickets) || normalTickets < 0) {
        return null;
    }

    reducedTickets = parseInt(reducedTickets, 10);
    if (isNaN(reducedTickets) || reducedTickets < 0) {
        return null;
    }

    childTickets = parseInt(childTickets, 10);
    if (isNaN(childTickets) || childTickets < 0) {
        return null;
    }

    if (normalTickets == 0 && reducedTickets == 0 && childTickets == 0) {
        return null;
    }

    return [normalTickets, reducedTickets, childTickets];
}

function calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets) {
    let stops = route.stops;
    let prices = route.prices;

    let firstStopIndex = stops.indexOf(firstStop);
    let lastStopIndex = stops.indexOf(lastStop);

    if (firstStopIndex == -1 || lastStopIndex == -1 || firstStopIndex >= lastStopIndex) {
        return null;
    }

    let multiplier = normalTickets + reducedTickets * 0.7;

    return multiplier * prices
        .slice(firstStopIndex, lastStopIndex)
        .reduce((a, b) => a + b);
}

router.get('/bookings', [minimumRole('client')], async (req, res, next) => {
    let role = roleDictionary.getRole(req.user.role);
    try {
        if (role == roles.client) {
            res.ok(await bookingController.findUserBookings(req.user.id));
        }
        else {
            res.ok(await bookingController.findAllBookings());
        }
    }
    catch {
        next(serverError());
    }
});

router.get('/bookings/past', [onlyRoles('client')], async (req, res, next) => {
    try {
        let dateTime = parseDateTime(new Date());
        let date = dateTime.getDate().toString();
        let hour = dateTime.getTime().toString();

        res.ok(await bookingController.findUserBookingsBeforeDate(req.user.id, date, hour));
    }
    catch {
        next(serverError());
    }
});

router.get('/bookings/future', [onlyRoles('client')], async (req, res, next) => {
    try {
        let dateTime = parseDateTime(new Date());
        let date = dateTime.getDate().toString();
        let hour = dateTime.getTime().toString();

        res.ok(await bookingController.findUserBookingsAfterDate(req.user.id, date, hour));
    }
    catch {
        next(serverError());
    }
});

router.get('/bookings/:routeId/:date/:hour', [minimumRole('driver')], async (req, res, next) => {
    let { routeId, date, hour } = req.params;

    routeId = parseInt(routeId, 10);
    date = parseDate(date)?.toString();
    hour = parseTime(hour)?.toString();

    if (isNaN(routeId) || date == null || hour == null) {
        return next(invalidRequest());
    }
    
    try {
        res.ok(await bookingController.findUserBookingsByRoute(routeId, date, hour));
    }
    catch (err) {
        next(err);
    }
});

router.post('/booking', [
    onlyRoles('client'),
    bodySchema(`{
        routeId: number,
        date: string,
        hour: string,
        normalTickets: number,
        reducedTickets: number,
        childTickets: number,
        firstStop: string,
        lastStop: string
    }`)
], async (req, res, next) => {
    let userId = req.user.id;

    let status = await userController.getBookLockStatus(userId);
    if (!status.canBook) {
        let expirationDate = parseDate(status.bookLockExpirationDate);
        let today = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);

        if (expirationDate.toObject() <= new Date()) {
            await userController.removeBookLock(userId);
        }
        else {
            return next(bookingLocked());
        }
    }

    let { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop } = req.body;

    routeId = parseInt(routeId, 10);
    date = parseDate(date)?.toString();
    hour = parseTime(hour)?.toString();
    firstStop = firstStop.trim();
    lastStop = lastStop.trim();

    if (isNaN(routeId) || date == null || hour == null) {
        return next(invalidRequest());
    }

    let tickets = validateTicketNumbers(normalTickets, reducedTickets, childTickets);

    if (tickets == null) {
        return next(invalidRequest());
    }
    [normalTickets, reducedTickets, childTickets] = tickets;

    let route;
    try {
        route = await routeController.findRoute(routeId);
    }
    catch (err) {
        return next(err);
    }

    route.hours = route.hours.sort().map((hour) => parseTime(hour)?.toString());

    if (!route.hours.includes(hour)) {
        return next(invalidRequest());
    }

    if (route.hours.length == 0) {
        return next(notFound());
    }

    let now = parseDateTime(new Date());
    let today = now.getDate().toString();
    let firstDeparture = parseDateTime(date + ' ' + route.hours[0]).toObject();
    
    if (date < today || (date == today && firstDeparture.getTime() - Date.now() < 2 * 3600 * 1000)) {
        return next(tooLate());
    }

    let price = calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets);

    if (price == null) {
        return next(invalidRequest());
    }

    let result;
    try {
        result = await bookingController.addBooking({
            userId,
            routeId,
            date,
            hour,
            normalTickets,
            reducedTickets,
            childTickets,
            firstStop,
            lastStop,
            price
        });
    }
    catch (err) {
        return next(err);
    }

    res.ok({ id: result.insertId });
});


router.post('/booking/:userId', [
    minimumRole('office'),
    bodySchema(`{
        routeId: number,
        date: string,
        hour: string,
        normalTickets: number,
        reducedTickets: number,
        childTickets: number,
        firstStop: string,
        lastStop: string
    }`)
], async (req, res, next) => {
    let userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) return next(invalidRequest());

    let { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop } = req.body;

    routeId = parseInt(routeId, 10);
    date = parseDate(date)?.toString();
    hour = parseTime(hour)?.toString();
    firstStop = firstStop.trim();
    lastStop = lastStop.trim();

    if (isNaN(routeId) || date == null || hour == null) {
        return next(invalidRequest());
    }

    let tickets = validateTicketNumbers(normalTickets, reducedTickets, childTickets);
    if (tickets == null) {
        return next(invalidRequest());
    }
    [normalTickets, reducedTickets, childTickets] = tickets;

    let route;
    try {
        route = await routeController.findRoute(routeId);
    }
    catch (err) {
        return next(err);
    }

    route.hours = route.hours.map((hour) => parseTime(hour)?.toString());

    if (!route.hours.includes(hour)) {
        return next(invalidRequest());
    }

    let price = calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets);

    if (price == null) {
        return next(invalidRequest());
    }

    let result;
    try {
        result = await bookingController.addBooking({
            userId,
            routeId,
            date,
            hour,
            normalTickets,
            reducedTickets,
            childTickets,
            firstStop,
            lastStop,
            price
        });
    }
    catch (err) {
        return next(err);
    }

    res.ok({ id: result.insertId });
});

router.delete('/booking/:bookingId', [onlyRoles('client', 'office', 'owner')], async (req, res, next) => {
    let wantedId = parseInt(req.params.bookingId, 10);
    if (isNaN(wantedId)) return next(invalidRequest());

    try {
        let booking = await bookingController.findBooking(wantedId);
    
        if (booking.userId != req.user.id && req.user.role != roles.office && req.user.role != roles.owner) {
            return next(unauthorized());
        }

        if (req.user.role == roles.client) {
            let bookingDate = parseDateTime(booking.date + ' ' + booking.hour);

            if (bookingDate.toObject().getTime() + 24 * 3600 * 1000 > Date.now()) {
                throw tooLate();
            }

            await bookingController.deleteBooking(wantedId, req.user.id);
        }
        else if (req.user.role == roles.office || req.user.role == roles.owner) {
            await bookingController.deleteBooking(wantedId);
        }
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

module.exports = router;
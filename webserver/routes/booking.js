const express = require('express');
const router = express.Router();
const { invalidRequest, unauthorized, serverError } = require('../errors');
const { minimumRole, onlyRoles, roles } = require('../middlewares/roles');
const bodySchema = require('../middlewares/body-schema');

const bookingController = require('../controllers/booking');
const routeController = require('../controllers/route');
const { parseDate, parseTime } = require('../helpers/date');


function validateTicketNumbers(normalTickets, reducedTickets, childTickets) {
    normalTickets = parseInt(normalTickets);
    if (isNaN(normalTickets) || normalTickets < 0) {
        return null;
    }

    reducedTickets = parseInt(reducedTickets);
    if (isNaN(reducedTickets) || reducedTickets < 0) {
        return null;
    }

    childTickets = parseInt(childTickets);
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

router.get('/bookings', [minimumRole('driver')], async (req, res, next) => {
    try {
        res.ok(await bookingController.findAllBookings());
    }
    catch {
        next(serverError());
    }
});

router.get('/bookings/:routeId/:date/:hour', [minimumRole('driver')], async (req, res, next) => {
    let { routeId, date, hour } = req.params;

    routeId = parseInt(routeId);
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
    minimumRole('client'),
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

    let { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop } = req.body;

    routeId = parseInt(routeId);
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
    let userId = parseInt(req.params.userId);
    if (isNaN(userId)) return next(invalidRequest());

    let { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop } = req.body;

    routeId = parseInt(routeId);
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
    let wantedId = parseInt(req.params.bookingId);
    if (isNaN(wantedId)) return next(invalidRequest());

    let booking;
    try {
        booking = await bookingController.findBooking(wantedId);
    }
    catch (err) {
        return next(err);
    }

    if (booking.userId != user.id && req.user.role != roles.office && req.user.role != roles.owner) {
        return next(unauthorized());
    }

    try {
        if (req.user.role == roles.client) {
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
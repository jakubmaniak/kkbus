const express = require('express');
const router = express.Router();
const { invalidRequest, unauthorized } = require('../errors');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);
const bodySchema = require('../middlewares/body-schema');

const bookingController = require('../controllers/booking');
const routeController = require('../controllers/route');


function calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets) {
    let stops = route.stops;
    let prices = route.prices;

    let firstStopIndex = stops.indexOf(firstStop);
    let lastStopIndex = stops.indexOf(lastStop);

    let multiplier = normalTickets + reducedTickets * 0.7;
    
    return multiplier * prices
        .slice(firstStopIndex, lastStopIndex)
        .reduce((a, b) => a + b);
}


router.post('/booking', [
    role('client'),
    bodySchema(`{
        hour: string,
        normalTickets: number,
        reducedTickets: number,
        childTickets: number,
        routeId: number,
        firstStop: string,
        lastStop: string
    }`)
], async (req, res, next) => {
    let userId = req.user.id;

    let { hour, normalTickets, reducedTickets, childTickets, routeId, firstStop, lastStop } = req.body;

    let route = await routeController.findRoute(routeId);
    let price = calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets);

    let result = await bookingController.addBooking({
        userId,
        hour,
        normalTickets,
        reducedTickets,
        childTickets,
        routeId,
        firstStop,
        lastStop,
        price
    });

    res.ok({ id: result.insertId });
});


router.post('/booking/:userId', [
    role('office'),
    bodySchema(`{
        hour: string,
        normalTickets: number,
        reducedTickets: number,
        childTickets: number,
        routeId: number,
        firstStop: string,
        lastStop: string
    }`)
], async (req, res, next) => {
    let userId = parseInt(req.params.userId);
    if (isNaN(userId)) return next(invalidRequest());

    let { hour, normalTickets, reducedTickets, childTickets, routeId, firstStop, lastStop } = req.body;
    let price = calculatePrice(route, firstStop, lastStop, normalTickets, reducedTickets);

    let result = await bookingController.addBooking({
        userId,
        hour,
        normalTickets,
        reducedTickets,
        childTickets,
        routeId,
        firstStop,
        lastStop,
        price
    });

    res.ok({ id: result.insertId });
});

router.delete('/booking/:bookingId', [role('client')], async (req, res, next) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) return next(invalidRequest());

    try {
        console.log(req.user);

        if (req.user.role == 'client') {
            await bookingController.deleteBooking(wantedId, req.user.id);
        }
        else if (req.user.role == 'office' || req.user.role == 'owner') {
            await bookingController.deleteBooking(wantedId);
        }
        else {
            throw unauthorized();
        }
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

module.exports = router;
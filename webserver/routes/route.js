const express = require('express');
const router = express.Router();

const { invalidRequest, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);

const routeController = require('../controllers/route');


const routes = new Map([
    [1, {
        id: 1,
        oppositeId: 2,
        departureLocation: 'Kraków',
        arrivalLocation: 'Katowice',
        prices: [4.00, 4.00, 4.00],
        stops: ['Kraków Dworzec Główny', 'Chrzanów', 'Jaworzno', 'Katowice'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [2, {
        id: 2,
        oppositeId: 1,
        departureLocation: 'Katowice',
        arrivalLocation: 'Kraków',
        prices: [6.00, 6.00],
        stops: ['Katowice', 'Chrzanów', 'Kraków Dworzec Główny'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [3, {
        id: 3,
        oppositeId: 4,
        departureLocation: 'Kraków',
        arrivalLocation: 'Warszawa',
        prices: [4.00, 5.00, 5.00],
        stops: ['Kraków Dworzec Główny', 'Kielce', 'Radom', 'Warszawa Centralna'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [4, {
        id: 4,
        oppositeId: 3,
        departureLocation: 'Warszawa',
        arrivalLocation: 'Kraków',
        prices: [5.00, 5.00, 4.00],
        stops: ['Warszawa Centralna', 'Radom', 'Kielce', 'Kraków Dworzec Główny'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }]
]);


router.get('/routes', async (req, res, next) => {
    res.ok(await routeController.findAllRoutes());
    /*res.ok(
        [...routes].map(([id, route]) => ({ id, ...route }))
    );*/
});

router.get('/route/:id', async (req, res, next) => {
    let routeId = parseInt(req.params.id);

    // let includeOpposite = ('includeOpposite' in req.query);

    if (isNaN(routeId)) return next(invalidRequest());

    // if (includeOpposite) {
    //     let route = routes.get(routeId);
    //     let oppositeId = route.oppositeId;
        
    //     if (oppositeId != null && routes.has(oppositeId)) {
    //         let oppositeRoute = routes.get(oppositeId);
    //         res.ok([route, oppositeRoute]);
    //     }
    //     else {
    //         res.ok([route, null]);
    //     }
    // }
    // else {
    try {
        res.ok(await routeController.findRoute(routeId));
    }
    catch (err) {
        next(err);
    }
    //  res.ok(routes.get(routeId));
    // }
});

router.post('/route', [
    role('office'),
    bodySchema(`{
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[]
    }`)
], async (req, res) => {
    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices } = req.body;

    if (hours == null) hours = [];
    if (stops == null) stops = [];
    if (prices == null) prices = [];

    hours = hours.map((hour) => hour.trim());
    stops = stops.map((stop) => stop.trim());

    let route = { oppositeId, departureLocation, arrivalLocation, hours, stops, prices };

    try {
        let result = await routeController.addRoute(route);
        res.ok({ id: result.insertId, ...route });
    }
    catch {
        next(serverError());
    }
});

router.delete('/route/:id', [role('office')], async (req, res, next) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) return next(invalidRequest());

    //routes.delete(routeId);

    try {
        await routeController.deleteRoute(routeId);
        res.ok();
    }
    catch {
        next(serverError());
    }
});

router.put('/route/:id', [
    role('office'),
    bodySchema(`{
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[]
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) return next(invalidRequest());

    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices } = req.body;

    if (hours == null) hours = [];
    if (stops == null) stops = [];
    if (prices == null) prices = [];

    hours = hours.map((hour) => hour.trim());
    stops = stops.map((stop) => stop.trim());

    let updatedRoute = { id: routeId, oppositeId, departureLocation, arrivalLocation, hours, stops, prices };

    //routes.set(routeId, updatedRoute);
    try {
        await routeController.updateRoute(routeId, updatedRoute);
        res.ok(updatedRoute);
    }
    catch {
        next(serverError());
    }
});

module.exports = router;
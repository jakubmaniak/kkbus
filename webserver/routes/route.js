const express = require('express');
const router = express.Router();

const { invalidRequest, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');

const routeController = require('../controllers/route');


router.get('/routes', async (req, res, next) => {
    res.ok(await routeController.findAllRoutes());

});

router.get('/route/:id', async (req, res, next) => {
    let routeId = parseInt(req.params.id, 10);

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
});

router.post('/route', [
    minimumRole('office'),
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

router.delete('/route/:id', [minimumRole('office')], async (req, res, next) => {
    let routeId = parseInt(req.params.id, 10);

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
    minimumRole('office'),
    bodySchema(`{
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[]
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.id, 10);

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
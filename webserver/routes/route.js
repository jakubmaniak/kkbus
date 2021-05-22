const express = require('express');
const router = express.Router();

const { invalidRequest, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');

const routeController = require('../controllers/route');


router.get('/routes', async (req, res, next) => {
    res.ok(await routeController.findAllRoutes());

});

router.get('/route/:routeId', async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);

    if (isNaN(routeId)) return next(invalidRequest());

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
        prices?: number[],
        distances?: number[]
    }`)
], async (req, res, next) => {
    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices, distances } = req.body;

    hours ??= [];
    stops ??= [];
    prices ??= [];
    distances ??= [];

    hours = hours.map((hour) => hour.trim());
    stops = stops.map((stop) => stop.trim());

    let route = { oppositeId, departureLocation, arrivalLocation, hours, stops, prices, distances };

    try {
        let result = await routeController.addRoute(route);
        res.ok({ id: result.insertId, ...route });
    }
    catch (err) {
        console.log(err);
        next(serverError());
    }
});

router.delete('/route/:routeId', [minimumRole('office')], async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);

    if (isNaN(routeId)) return next(invalidRequest());

    try {
        await routeController.deleteRoute(routeId);
        res.ok();
    }
    catch {
        next(serverError());
    }
});

router.put('/route/:routeId', [
    minimumRole('office'),
    bodySchema(`{
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[],
        distances?: number[]
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);

    if (isNaN(routeId)) return next(invalidRequest());

    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices, distances } = req.body;

    hours ??= [];
    stops ??= [];
    prices ??= [];
    distances ??= [];

    hours = hours.map((hour) => hour.trim());
    stops = stops.map((stop) => stop.trim());

    let updatedRoute = { id: routeId, oppositeId, departureLocation, arrivalLocation, hours, stops, prices, distances };

    try {
        await routeController.updateRoute(routeId, updatedRoute);
        res.ok(updatedRoute);
    }
    catch {
        next(serverError());
    }
});

module.exports = router;
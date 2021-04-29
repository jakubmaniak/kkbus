const express = require('express');
const router = express.Router();

const { serverError, invalidValue } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');
const { parseDateTime } = require('../helpers/date');

const routeReportController = require('../controllers/route-report');
const vehicleController = require('../controllers/vehicle');
const routeController = require('../controllers/route');


router.post('/reports/route/:routeId', [
    minimumRole('driver'),
    bodySchema(`{
        stop: string,
        vehicleId: number,
        amount: number
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);
    if (isNaN(routeId)) return next(invalidValue());

    let { stop, vehicleId, amount } = req.body;
    
    if (amount < 0) {
        return next(invalidValue());
    }

    try {
        await vehicleController.findVehicle(vehicleId);
        let route = await routeController.findRoute(routeId);

        if (!route.stops.includes(stop)) {
            throw invalidValue();
        }
    }
    catch (err) {
        return next(err);
    }

    try {
        let result = await routeReportController.addReport({
            routeId,
            stop,
            vehicleId,
            date: parseDateTime(new Date()).toString(3),
            amount
        });

        res.ok({ id: result.insertId });
    }
    catch {
        return next(serverError());
    }
});


module.exports = router;
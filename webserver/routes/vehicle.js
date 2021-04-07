const express = require('express');
const router = express.Router();

const { invalidRequest, serverError } = require('../errors');
const { deleteProps, resolveDateTime3 } = require('../helpers/query-utils');
const { parseDateTime } = require('../helpers/date');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);

const vehicleController = require('../controllers/vehicle');
const refuelController = require('../controllers/refuel');


router.get('/vehicles', [role('driver')], async (req, res, next) => {
    let vehicles = (await vehicleController.findAllVehicles()).map((vehicle) => ({
        ...vehicle,
        combustion: 0,
        driver: null
    }));
    res.ok(vehicles);
});

router.get('/vehicle/:id', [role('driver')], async (req, res, next) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) return next(invalidRequest());

    let vehicle;
    try {
        vehicle = await vehicleController.findVehicle(wantedId);
    }
    catch (err) {
        return next(err);
    }
    
    vehicle = { ...vehicle, combustion: 0, driver: null };

    res.ok(vehicle);
});

router.post('/vehicle', [
    role('owner'),
    bodySchema(`{
        state?: string,
        brand: string,
        model: string,
        year: number,
        plate?: string,
        parking?: string,
        routeId?: number,
        seats: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let { state, brand, model, year, plate, parking, routeId, seats, mileage } = req.body;

    if (mileage == null) mileage = 0;

    let result = await vehicleController.addVehicle({
        state,
        brand,
        model,
        year,
        plate,
        parking,
        routeId,
        seats,
        mileage
    });

    res.ok({ id: result.insertId });
});

router.put('/vehicle/:id', [
    role('owner'),
    bodySchema(`{
        state?: string,
        brand: string,
        model: string,
        year: number,
        plate?: string,
        parking?: string,
        routeId?: number,
        seats: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) return next(invalidRequest());

    let { state, brand, model, year, plate, parking, routeId, seats, mileage } = req.body;

    if (mileage == null) mileage = 0;

    let updatedVehicle = {
        state,
        brand,
        model,
        year,
        plate,
        parking,
        routeId,
        seats,
        mileage
    };

    try {
        await vehicleController.updateVehicle(wantedId, updatedVehicle);
    }
    catch (err) {
        return next(err);
    }

    res.ok({ id: wantedId, ...updatedVehicle, combustion: 0, driver: null });
});

router.delete('/vehicle/:id', [role('owner')], async (req, res, next) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) return next(invalidRequest());

    try {
        await vehicleController.deleteVehicle(wantedId);
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

router.get('/vehicle/:vehicleId/refuels', [role('driver')], async (req, res, next) => {
    let vehicleId = parseInt(req.params.vehicleId);
    if (isNaN(vehicleId)) return next(invalidRequest());

    try {
        let refuels = await refuelController.findVehicleRefuels(vehicleId)
            .then(deleteProps('vehicleId'))
            .then(resolveDateTime3('date'));
        res.ok(refuels);
    }
    catch {
        next(serverError());
    }
});

router.post('/vehicle/:vehicleId/refuel', [
    role('driver'),
    bodySchema(`{
        cost: number,
        amount: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let vehicleId = parseInt(req.params.vehicleId);
    if (isNaN(vehicleId)) return next(invalidRequest());

    let { cost, amount, mileage } = req.body;
    let date = parseDateTime(new Date());

    let vehicle;
    try {
        vehicle = await vehicleController.findVehicle(vehicleId);
    }
    catch (err) {
        return next(err);
    }

    let result;
    try {
        result = await refuelController.addRefuel({
            vehicleId,
            cost,
            amount,
            mileage,
            date
        });
        
        if (mileage > vehicle.mileage) {
            await vehicleController.updateVehicle(vehicleId, {
                ...vehicle,
                mileage
            });
        }
    }
    catch {
        return next(serverError());
    }

    res.ok({ id: result.insertId });
});


module.exports = router;
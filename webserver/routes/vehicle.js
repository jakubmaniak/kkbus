const express = require('express');
const router = express.Router();

const { invalidRequest, serverError, invalidValue } = require('../errors');
const { deleteProps, resolveDateTime3 } = require('../helpers/query-utils');
const { parseDateTime } = require('../helpers/date');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');

const vehicleController = require('../controllers/vehicle');
const refuelController = require('../controllers/refuel');


router.get('/vehicles', [minimumRole('driver')], async (req, res, next) => {
    let vehicles = (await vehicleController.findAllVehicles()).map((vehicle) => ({
        ...vehicle,
        driver: null,
        combustion: parseFloat(vehicle.combustion?.toFixed(3) ?? 0),
        routeIds: vehicle.routeIds.map((id) => parseInt(id, 10))
    }));
    res.ok(vehicles);
});

router.get('/vehicle/:id', [minimumRole('driver')], async (req, res, next) => {
    let wantedId = parseInt(req.params.id, 10);
    if (isNaN(wantedId)) return next(invalidRequest());

    let vehicle;
    try {
        vehicle = await vehicleController.findVehicle(wantedId);
    }
    catch (err) {
        return next(err);
    }
    
    vehicle = { 
        ...vehicle,
        driver: null,
        combustion: parseFloat(vehicle.combustion?.toFixed(3) ?? 0),
        routeIds: vehicle.routeIds.map((id) => parseInt(id, 10))
    };

    res.ok(vehicle);
});

router.post('/vehicle', [
    minimumRole('owner'),
    bodySchema(`{
        state?: string,
        brand: string,
        model: string,
        year: number,
        plate?: string,
        parking?: string,
        routeIds?: number[],
        seats: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let { state, brand, model, year, plate, parking, routeIds, seats, mileage } = req.body;

    if (mileage == null) mileage = 0;

    let result = await vehicleController.addVehicle({
        state,
        brand,
        model,
        year,
        plate,
        parking,
        routeIds,
        seats,
        mileage
    });

    res.ok({ id: result.insertId });
});

router.put('/vehicle/:id', [
    minimumRole('owner'),
    bodySchema(`{
        state?: string,
        brand: string,
        model: string,
        year: number,
        plate?: string,
        parking?: string,
        routeIds?: number[],
        seats: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let wantedId = parseInt(req.params.id, 10);
    if (isNaN(wantedId)) return next(invalidRequest());

    let { state, brand, model, year, plate, parking, routeIds, seats, mileage } = req.body;

    if (mileage == null) mileage = 0;

    let updatedVehicle = {
        state,
        brand,
        model,
        year,
        plate,
        parking,
        routeIds,
        seats,
        mileage
    };

    try {
        await vehicleController.updateVehicle(wantedId, updatedVehicle);
    }
    catch (err) {
        return next(err);
    }

    res.ok({ id: wantedId, ...updatedVehicle });
});

router.delete('/vehicle/:id', [minimumRole('owner')], async (req, res, next) => {
    let wantedId = parseInt(req.params.id, 10);
    if (isNaN(wantedId)) return next(invalidRequest());

    try {
        await vehicleController.deleteVehicle(wantedId);
    }
    catch (err) {
        return next(err);
    }

    res.ok();
});

router.get('/vehicle/:vehicleId/refuels', [minimumRole('driver')], async (req, res, next) => {
    let vehicleId = parseInt(req.params.vehicleId, 10);
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
    minimumRole('driver'),
    bodySchema(`{
        cost: number,
        amount: number,
        mileage?: number
    }`)
], async (req, res, next) => {
    let vehicleId = parseInt(req.params.vehicleId, 10);
    if (isNaN(vehicleId)) return next(invalidValue());

    let { cost, amount, mileage } = req.body;
    
    if (cost < 0 || amount <= 0 || mileage < 0) {
        return next(invalidValue());
    }

    try {
        let vehicle = await vehicleController.findVehicle(vehicleId);
        
        if (mileage < vehicle.mileage) {
            throw invalidValue();
        }

        let addRefuel = refuelController.addRefuel({
            vehicleId,
            cost,
            amount,
            mileage,
            date: parseDateTime(new Date())
        });
        
        let updateVehicle = null;
        
        if (mileage > vehicle.mileage) {
            updateVehicle = vehicleController.updateVehicle(vehicleId, {
                ...vehicle,
                mileage
            });
        }

        let [result, ] = await Promise.all([
            addRefuel,
            updateVehicle
        ]);

        res.ok({ id: result.insertId });
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
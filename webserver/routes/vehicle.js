const express = require('express');
const router = express.Router();

const { invalidRequest } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);

const vehicleController = require('../controllers/vehicle');

let fuelHistory = new Map([
    [1, [
        { date: '2021-03-02 15:09', cost: 203.45, amount: 40.7, mileage: 1330087 },
        { date: '2021-03-03 15:11', cost: 183.45, amount: 36.4, mileage: 1331223 },
        { date: '2021-03-04 15:06', cost: 203.31, amount: 40.8, mileage: 1332057 },
        { date: '2021-03-05 15:08', cost: 203.52, amount: 40.7, mileage: 1333483 }
    ]],
    [2, [
        { date: '2021-03-02 15:09', cost: 203.45, amount: 40.7, mileage: 1330087 },
        { date: '2021-03-03 15:11', cost: 183.45, amount: 36.4, mileage: 1331223 },
        { date: '2021-03-04 15:06', cost: 203.31, amount: 40.8, mileage: 1332057 },
        { date: '2021-03-05 15:08', cost: 203.52, amount: 40.7, mileage: 1333483 },
        { date: '2021-03-06 15:08', cost: 202.50, amount: 40.6, mileage: 1334403 },
        { date: '2021-03-07 15:08', cost: 200.12, amount: 40.5, mileage: 1335489 }
    ]]
]);

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

router.get('/vehicle/:id/fuel-usage', [role('driver')], (req, res) => {
    let vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) throw invalidRequest();

    res.ok(fuelHistory.get(vehicleId) || []);
});


module.exports = router;
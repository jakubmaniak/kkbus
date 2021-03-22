const express = require('express');
const router = express.Router();

const { invalidRequest, notFound } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


let vehicles = [
    {
        id: 1,
        name: 'Mercedes Sprinter 2014',
        plate: 'KR 111 AB',
        state: 'Aktywny',
        parking: 'Parking nr 1',
        ab: 'Kraków - Katowice',
        ba: 'Katowice - Kraków',
        seats: 22,
        mileage: 10000000,
        combustion: 8.9,
        driver: 'Tomasz Rajdowiec'
    },
    {
        id: 2,
        name: 'Ford Transit 2016',
        plate: 'KR 124 AO',
        state: 'Aktywny',
        parking: 'Parking nr 1',
        ab: 'Kraków - Katowice',
        ba: 'Katowice - Kraków',
        seats: 18,
        mileage: 900000,
        combustion: 9,
        driver: 'Kazimierz Rajdowiec'
    },
    {
        id: 3,
        name: 'Iveco Daily 2014',
        plate: 'KR 875 CF',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        ab: 'Kraków - Katowice',
        ba: 'Katowice - Kraków',
        seats: 22,
        mileage: 9.5,
        combustion: 80500300,
        driver: 'Mirosław Szybki'
    },
    {
        id: 4,
        name: 'Fiat Ducato 2014',
        plate: 'KR 222 KM',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        ab: 'Kraków - Katowice',
        ba: 'Katowice - Kraków',
        seats: 15,
        mileage: 9.4,
        combustion: 10540003,
        driver: 'Jan Doświadczony'
    },
    {
        id: 5,
        name: 'Scania Touring 2015',
        plate: 'KR 990 JB',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        ab: 'Kraków - Katowice',
        ba: 'Katowice - Kraków',
        seats: 55,
        mileage: 7.9,
        combustion: 9023305,
        driver: 'Marek Poprawny'
    }
];

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

router.get('/vehicles', [role('driver')], (req, res) => {
    res.ok(vehicles);
});

router.get('/vehicle/:id', [role('driver')], (req, res) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) throw invalidRequest;

    let vehicleIndex = vehicles.findIndex(({id}) => id === wantedId);
    if (vehicleIndex < 0) throw notFound;

    res.ok(vehicles[vehicleIndex]);
});

router.post('/vehicle', [
    role('owner'),
    bodySchema(`{
        name: string,
        plate: string,
        mileage: number,
        seats: number,
        state?: string,
        parking?: string,
        ab?: string, ba?: string,
        driver?: string
    }`)
], (req, res) => {
    let id = Math.max(...vehicles.map(({id}) => id)) + 1;
    let { name, plate, mileage, seats, state, parking, ab, ba, driver } = req.body;
    
    for (let prop in { state, parking, ab, ba, driver }) {
        if (req.body[prop] !== undefined && req.body[prop] !== null) continue;
        
        switch (prop) {
            case 'state': state = 'Aktywny'; break;
            case 'parking': parking = null; break;
            case 'ab': ab = null; break;
            case 'ba': ba = null; break;
            case 'driver': driver = null; break;
        }
    }

    vehicles.push({
        id,
        name,
        plate,
        mileage,
        seats,
        state,
        parking,
        ab, ba,
        driver,
        combustion: 0
    });

    res.ok({ id });
});

router.put('/vehicle/:id', [
    role('owner'),
    bodySchema(`{
        name: string,
        plate: string,
        mileage: number,
        seats: number,
        state?: string,
        parking?: string,
        ab?: string, ba?: string,
        driver?: string
    }`)
], (req, res) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) throw invalidRequest;

    let vehicleIndex = vehicles.findIndex(({id}) => id === wantedId);
    if (vehicleIndex < 0) throw notFound;

    let { name, plate, mileage, seats, state, parking, ab, ba, driver } = req.body;
    
    for (let prop in { state, parking, ab, ba, driver }) {
        if (req.body[prop] !== undefined && req.body[prop] !== null) continue;
        
        switch (prop) {
            case 'state': state = 'Aktywny'; break;
            case 'parking': parking = null; break;
            case 'ab': ab = null; break;
            case 'ba': ba = null; break;
            case 'driver': driver = null; break;
        }
    }

    vehicles[vehicleIndex] = {
        ...vehicles[vehicleIndex],
        name,
        plate,
        mileage,
        seats,
        state,
        parking,
        ab, ba,
        driver
    };

    res.ok();
});

router.delete('/vehicle/:id', [role('owner')], (req, res) => {
    let wantedId = parseInt(req.params.id);
    if (isNaN(wantedId)) throw invalidRequest;

    let vehicleIndex = vehicles.findIndex(({id}) => id === wantedId);
    if (vehicleIndex < 0) throw notFound;

    vehicles.splice(vehicleIndex);

    res.ok();
});

router.get('/vehicle/:id/fuel-usage', [role('driver')], (req, res) => {
    let vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) throw invalidRequest;

    res.ok(fuelHistory.get(vehicleId) || []);
});


module.exports = router;
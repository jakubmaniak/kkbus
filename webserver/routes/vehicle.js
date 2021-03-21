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


let vehicles = [
    {
        id: 1,
        registration: 'KR 111 AB',
        name: 'Mercedes Sprinter 2014',
        state: 'Aktywny',
        parking: 'Parking nr 1',
        oneWayTrack: 'Kraków - Katowice',
        returnTrack: 'Katowice - Kraków',
        seats: 22,
        mileage: 10000000,
        avgCombustion: 8.9,
        currentDriver: 'Tomasz Rajdowiec'
    },
    {
        id: 2,
        registration: 'KR 124 AO',
        name: 'Ford Transit 2016',
        state: 'Aktywny',
        parking: 'Parking nr 1',
        oneWayTrack: 'Kraków - Katowice',
        returnTrack: 'Katowice - Kraków',
        seats: 18,
        mileage: 900000,
        avgCombustion: 9,
        currentDriver: 'Kazimierz Rajdowiec'
    },
    {
        id: 3,
        registration: 'KR 875 CF',
        name: 'Iveco Daily 2014',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        oneWayTrack: 'Kraków - Katowice',
        returnTrack: 'Katowice - Kraków',
        seats: 22,
        mileage: 9.5,
        avgCombustion: 80500300,
        currentDriver: 'Mirosław Szybki'
    },
    {
        id: 4,
        registration: 'KR 222 KM',
        name: 'Fiat Ducato 2014',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        oneWayTrack: 'Kraków - Katowice',
        returnTrack: 'Katowice - Kraków',
        seats: 15,
        mileage: 9.4,
        avgCombustion: 10540003,
        currentDriver: 'Jan Doświadczony'
    },
    {
        id: 5,
        registration: 'KR 990 JB',
        name: 'Scania Touring 2015',
        state: 'Aktywny',
        parking: 'Parking nr 2',
        oneWayTrack: 'Kraków - Katowice',
        returnTrack: 'Katowice - Kraków',
        seats: 55,
        mileage: 7.9,
        avgCombustion: 9023305,
        currentDriver: 'Marek Poprawny'
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

router.post('/vehicle', [role('owner')], (req, res) => {
    res.ok();
});

router.put('/vehicle/:id', [role('owner')], (req, res) => {
    res.ok();
});

router.delete('/vehicle/:id', [role('owner')], (req, res) => {
    res.ok();
});

router.get('/vehicle/:id/fuel-usage', [role('driver')], (req, res) => {
    let vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) throw invalidRequest;

    res.ok(fuelHistory.get(vehicleId) || []);
});


module.exports = router;
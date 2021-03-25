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


const routes = new Map([
    [1, {
        id: 1,
        a: {
            departureLocation: 'Kraków',
            prices: [4.00, 4.00, 4.00],
            stops: ['Kraków Dworzec Główny', 'Chrzanów', 'Jaworzno', 'Katowice'],
            hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
        },
        b: {
            departureLocation: 'Katowice',
            prices: [6.00, 6.00],
            stops: ['Katowice', 'Chrzanów', 'Kraków Dworzec Główny'],
            hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
        }
    }],
    [2, {
        id: 2,
        a: {
            departureLocation: 'Kraków',
            prices: [4.00, 5.00, 5.00],
            stops: ['Kraków Dworzec Główny', 'Kielce', 'Radom', 'Warszawa Centralna'],
            hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
        },
        b: {
            departureLocation: 'Warszawa',
            prices: [5.00, 5.00, 4.00],
            stops: ['Warszawa Centralna', 'Radom', 'Kielce', 'Kraków Dworzec Główny'],
            hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
        }
    }]
]);


router.get('/routes', (req, res) => {
    res.ok(
        [...routes].map(([id, route]) => ({ id, ...route }))
    );
});

router.get('/route/:id', (req, res) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    res.ok({ id: routeId, ...routes.get(routeId) });
});

router.post('/route', [
    role('office'),
    bodySchema(`{
        a: {
            departureLocation: string,
            hours?: string[],
            stops?: string[],
            prices?: number[]
        },
        b: {
            departureLocation: string,
            hours?: string[],
            stops?: string[],
            prices?: number[]
        }
    }`)
], (req, res) => {
    let { a, b } = req.body;

    if (a.hours == null) a.hours = [];
    if (a.stops == null) a.stops = [];
    if (a.prices == null) a.prices = [];

    if (b.hours == null) b.hours = [];
    if (b.stops == null) b.stops = [];
    if (b.prices == null) b.prices = [];

    let id = Math.max(...routes.keys()) + 1;

    routes.set(id, { id, a, b });

    res.ok({ id });
});

router.delete('/route/:id', [role('office')], (req, res) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    routes.delete(routeId);

    res.ok();
});

router.put('/route/:id', [
    role('office'),
    bodySchema(`{
        a: {
            departureLocation: string,
            hours?: string[],
            stops?: string[],
            prices?: number[]
        },
        b: {
            departureLocation: string,
            hours?: string[],
            stops?: string[],
            prices?: number[]
        }
    }`)
], (req, res) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    let { a, b } = req.body;

    if (a.hours == null) a.hours = [];
    if (a.stops == null) a.stops = [];
    if (a.prices == null) a.prices = [];

    if (b.hours == null) b.hours = [];
    if (b.stops == null) b.stops = [];
    if (b.prices == null) b.prices = [];

    routes.set(routeId, { id: routeId, a, b });
    
    res.ok();
});

module.exports = router;
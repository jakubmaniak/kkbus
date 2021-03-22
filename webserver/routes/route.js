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
    [1, { a: 'Kraków', b: 'Katowice', stops: [], prices: [] }],
    [2, { a: 'Kraków', b: 'Warszawa', stops: [], prices: [] }]
]);


router.get('/routes', (req, res) => {
    res.ok(
        [...routes].map(([id, route]) => ({ id, ...route }))
    );
});

router.post('/route', [
    role('office'),
    bodySchema('{a: string, b: string, stops?: string[], prices?: string[]}')
], (req, res) => {
    let { a, b, stops, prices } = req.body;

    if (stops == undefined || stops == null) stops = [];
    if (prices == undefined || prices == null) prices = [];

    let id = Math.max(...routes.keys()) + 1;

    routes.set(id, {
        id,
        a, b,
        stops, prices
    });

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
    bodySchema('{a: string, b: string, stops?: string[], prices?: string[]}')
], (req, res) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    let { a, b, stops, prices } = req.body;

    if (stops == undefined || stops == null) stops = [];
    if (prices == undefined || prices == null) prices = [];

    routes.set(routeId, {
        id: routeId,
        a, b,
        stops, prices
    });

    res.ok();
});

module.exports = router;
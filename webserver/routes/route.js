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
        oppositeId: 2,
        departureLocation: 'Kraków',
        arrivalLocation: 'Katowice',
        prices: [4.00, 4.00, 4.00],
        stops: ['Kraków Dworzec Główny', 'Chrzanów', 'Jaworzno', 'Katowice'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [2, {
        id: 2,
        oppositeId: 1,
        departureLocation: 'Katowice',
        arrivalLocation: 'Kraków',
        prices: [6.00, 6.00],
        stops: ['Katowice', 'Chrzanów', 'Kraków Dworzec Główny'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [3, {
        id: 3,
        oppositeId: 4,
        departureLocation: 'Kraków',
        arrivalLocation: 'Warszawa',
        prices: [4.00, 5.00, 5.00],
        stops: ['Kraków Dworzec Główny', 'Kielce', 'Radom', 'Warszawa Centralna'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }],
    [4, {
        id: 4,
        oppositeId: 3,
        departureLocation: 'Warszawa',
        arrivalLocation: 'Kraków',
        prices: [5.00, 5.00, 4.00],
        stops: ['Warszawa Centralna', 'Radom', 'Kielce', 'Kraków Dworzec Główny'],
        hours: ['5:15', '6:00', '6:30', '7:00', '8:00', '9:00', '11:00', '12:00', '12:30', '13:30', '14:00', '14:30', '16:00', '17:00', '18:00', '20:00', '22:30', '23:00']
    }]
]);


router.get('/routes', (req, res) => {
    res.ok(
        [...routes].map(([id, route]) => ({ id, ...route }))
    );
});

router.get('/route/:id', (req, res) => {
    let routeId = parseInt(req.params.id);

    let includeOpposite = ('includeOpposite' in req.query);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    if (includeOpposite) {
        let route = routes.get(routeId);
        let oppositeId = route.oppositeId;
        
        if (oppositeId != null && routes.has(oppositeId)) {
            let oppositeRoute = routes.get(oppositeId);
            res.ok([route, oppositeRoute]);
        }
        else {
            res.ok([route, null]);
        }
    }
    else {
        res.ok(routes.get(routeId));
    }
});

router.post('/route', [
    role('office'),
    bodySchema(`{
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[]
    }`)
], (req, res) => {
    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices } = req.body;

    if (hours == null) hours = [];
    if (stops == null) stops = [];
    if (prices == null) prices = [];

    let id = Math.max(...routes.keys()) + 1;
    routes.set(id, { id, oppositeId, departureLocation, arrivalLocation, hours, stops, prices });

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
        oppositeId?: number,
        departureLocation: string,
        arrivalLocation: string,
        hours?: string[],
        stops?: string[],
        prices?: number[]
    }`)
], (req, res) => {
    let routeId = parseInt(req.params.id);

    if (isNaN(routeId)) throw invalidRequest;
    if (!routes.has(routeId)) throw notFound;

    let { oppositeId, departureLocation, arrivalLocation, hours, stops, prices } = req.body;

    if (hours == null) hours = [];
    if (stops == null) stops = [];
    if (prices == null) prices = [];

    routes.set(routeId, { id: routeId, oppositeId, departureLocation, arrivalLocation, hours, stops, prices });
    
    res.ok();
});

module.exports = router;
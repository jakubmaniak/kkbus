const express = require('express');
const { invalidRequest, notFound } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const router = express.Router();
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);

const userPoints = new Map([
    ['annanowak1234', 1000000]
]);

const rewards = new Map([
    [1, { id: 1, name: 'Zniżka 10%', requiredPoints: 5000, amount: 0, limit: 0 }],
    [2, { id: 2, name: 'Zniżka 20%', requiredPoints: 8000, amount: 0, limit: 0 }],
    [3, { id: 3, name: 'Zniżka 40%', requiredPoints: 12000, amount: 0, limit: 0 }],
    [4, { id: 4, name: 'Mała maskotka firmy', requiredPoints: 12000, amount: 500, limit: 3 }],
    [5, { id: 5, name: 'Duża maskotka firmy', requiredPoints: 20000, amount: 100, limit: 1 }]
]);


router.get('/loyalty-program', (req, res) => {
    let { login, role } = req.user;
    
    let points = 0;

    if (role === 'client') {
        points = userPoints.get(login);
    }

    res.ok({ points, rewards: [...rewards.values()] });
});

router.get('/loyalty-program/rewards', (req, res) => {
    res.ok([...rewards.values()]);
});

router.get('/loyalty-program/reward/:id', [role('client')], (req, res) => {
    let id = parseInt(req.params.id);
    if (isNaN(id)) throw invalidRequest();

    let { login } = req.user;

    if (!rewards.has(id)) throw notFound();
    if (!userPoints.has(login)) throw invalidRequest();
    
    let reward = rewards.get(id);
    let points = userPoints.get(login);
    
    if (points < reward.requiredPoints) throw invalidRequest();

    points -= reward.requiredPoints;
    userPoints.set(login, points);

    res.ok({ points });
});

router.post('/loyalty-program/reward', [
    role('owner'),
    bodySchema('{name: string, requiredPoints: number, amount?: number, limit?: number}')
], (req, res) => {
    let { name, requiredPoints, amount, limit } = req.body;

    let id = rewards.size + 1;

    rewards.set(id, {
        id, name,
        requiredPoints,
        amount, limit
    });

    res.ok({ id });
});

router.put('/loyalty-program/reward/:id', [
    role('owner'),
    bodySchema('{name: string, requiredPoints: number, amount: number, limit: number}')
], (req, res) => {
    let id = parseInt(req.params.id);
    
    if (isNaN(id)) throw invalidRequest();
    if (!rewards.has(id)) throw notFound();

    let { name, requiredPoints, amount, limit } = req.body;

    let updatedReward = {
        id,
        name,
        requiredPoints,
        amount,
        limit
    };

    rewards.set(id, updatedReward);

    res.ok(updatedReward);
});

router.delete('/loyalty-program/reward/:id', [role('owner')], (req, res) => {
    let id = parseInt(req.params.id);
    if (isNaN(id)) throw invalidRequest();

    if (!rewards.has(id)) throw notFound();

    rewards.delete(id);

    res.ok();
});

module.exports = router;
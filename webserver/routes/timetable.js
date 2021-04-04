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


let timetable = [
    {
        userId: 1,
        name: 'Kazimierz Rajdowiec',
        role: 'driver',
        items: [
            {
                id: 0,
                available: true,
                label: null,
                startDate: '2021-04-03',
                days: 1,
                ranges: ['10:00 - 20:00']
            },
            {
                id: 33,
                available: true,
                label: null,
                startDate: '2021-04-04',
                days: 1,
                ranges: ['10:00 - 14:00', '18:00 - 22:00']
            },
            {
                id: 34,
                available: true,
                label: null,
                startDate: '2021-04-05',
                days: 3,
                ranges: ['12:00 - 20:00']
            },
            {
                id: 2,
                available: false,
                label: null,
                startDate: '2021-04-08',
                days: 2,
                ranges: ['12:00 - 16:00']
            }
        ]
    },
    {
        userId: 2,
        name: 'Tomasz Rajdowiec',
        role: 'driver',
        items: [
            {
                id: 4,
                available: true,
                label: null,
                startDate: '2021-04-03',
                days: 2,
                ranges: ['12:00 - 20:00']
            },
            {
                id: 5,
                available: false,
                label: null,
                startDate: '2021-04-05',
                days: 2,
                ranges: ['12:00 - 16:00']
            },
            {
                id: 6,
                available: true,
                label: null,
                startDate: '2021-04-07',
                days: 3,
                ranges: ['12:00 - 20:00']
            }
        ]
    },
    {
        userId: 3,
        name: 'Mirosław Szybki',
        role: 'driver',
        items: [
            {
                id: 7,
                available: true,
                label: null,
                startDate: '2021-04-03',
                days: 2,
                ranges: ['10:00 - 20:00']
            }
        ]
    },
    {
        userId: 4,
        name: 'Jan Doświadczony',
        role: 'driver',
        items: [
            {
                id: 8,
                available: true,
                label: null,
                startDate: '2021-04-04',
                days: 4,
                ranges: ['16:00 - 24:00']
            }
        ]
    }
];


router.get('/timetable', [role('driver')], (req, res) => {
    res.ok(timetable);
});

router.post('/timetable/:userId', [
    role('driver'),
    bodySchema(`{
        available: boolean,
        label?: string,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], async (req, res, next) => {
    let { available, label, startDate, days, ranges } = req.body;
    
    let userId = parseInt(req.params.userId);
    if (isNaN(userId)) return next(invalidRequest());

    let user = timetable.find((user) => user.userId == userId);

    if (!user) {
        user = {
            userId,
            name: 'Jan Testowy' + userId,
            role: 'driver',
            items: []
        };

        timetable.push(user);
    }

    let itemId = Math.max(...timetable.map((u) => u.items.map((i) => i.id)).flat()) + 1;
    let item = { id: itemId, available, label, startDate, days, ranges };

    user.items.push(item);
    res.ok(item);
});

router.put('/timetable/:itemId', [
    role('driver'),
    bodySchema(`{
        available: boolean,
        startDate: string,
        days: number,
        ranges: string[]
    }`)
], (req, res) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) throw invalidRequest();

    let { available, label, startDate, days, ranges } = req.body;

    let targetEmployee = null;
    let itemIndex;

    for (let employee of timetable) {
        itemIndex = employee.items.findIndex(({ id }) => id == wantedId);
        
        if (itemIndex >= 0) {
            targetEmployee = employee;
            break;
        }
    }

    if (targetEmployee == null) {
        return next(notFound());
    }
    
    let updatedItem = { id: wantedId, available, label, startDate, days, ranges };
    targetEmployee.items[itemIndex] = updatedItem;

    res.ok(updatedItem);
});

router.delete('/timetable/:itemId', [role('driver')], async (req, res, next) => {
    let wantedId = parseInt(req.params.itemId);
    if (isNaN(wantedId)) throw invalidRequest();

    let targetEmployee = null;
    let itemIndex;

    for (let employee of timetable) {
        itemIndex = employee.items.findIndex(({ id }) => id == wantedId);
        
        if (itemIndex >= 0) {
            targetEmployee = employee;
            break;
        }
    }

    if (targetEmployee == null) {
        next(notFound());
    }
    else {
        targetEmployee.items.splice(itemIndex, 1);

        if (targetEmployee.items.length == 0) {
            timetable.splice(timetable.indexOf(targetEmployee), 1);
        }

        res.ok();
    }
});


module.exports = router;
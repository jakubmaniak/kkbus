const express = require('express');
const router = express.Router();
const errors = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


router.post('/work-schedule', [
    role('client')//,
    //bodySchema('{driverId: number, range: number, direction: number, routeId?: number}')
], (req, res) => {
    let { driverId, range, direction, routeId } = req.body;

    let ab = [];
    let ba = [];

    if ((routeId == null || routeId == 1) && (range == 0 || range > 1)) {
        let end = 'Kraków';

        ab = ab.concat([
            {
                start: 'Kraków',
                end,
                day: 'dzisiaj',
                hour: '13:30',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: 'Kraków, parking Czyżyny, ',
                parkingInfo: 'początkowy'
            },
            {
                start: 'Kraków',
                end,
                day: 'dzisiaj',
                hour: '17:00',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: 'Kraków',
                end: end,
                day: 'dzisiaj',
                hour: '20:30',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
        ]);
    
        ba = ba.concat([
            {
                start: end,
                end: 'Kraków',
                day: 'dzisiaj',
                hour: '15:15',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: end,
                end: 'Kraków',
                day: 'dzisiaj',
                hour: '18:45',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: end,
                end: 'Kraków',
                day: 'dzisiaj',
                hour: '22:15',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: 'Kraków, parking Czyżyny, ',
                parkingInfo: 'końcowy'
            }
        ]);
    }
    if ((routeId == null || routeId == 2) && range >= 1) {
        let end = 'Warszawa';

        ab = ab.concat([
            {
                start: 'Kraków',
                end,
                day: 'jutro',
                hour: '13:30',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: 'Kraków, parking Czyżyny, ',
                parkingInfo: 'początkowy'
            },
            {
                start: 'Kraków',
                end,
                day: 'jutro',
                hour: '17:00',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: 'Kraków',
                end: end,
                day: 'jutro',
                hour: '20:30',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
        ]);
    
        ba = ba.concat([
            {
                start: end,
                end: 'Kraków',
                day: 'jutro',
                hour: '15:15',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: end,
                end: 'Kraków',
                day: 'jutro',
                hour: '18:45',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: '-',
                parkingInfo: ''
            },
            {
                start: end,
                end: 'Kraków',
                day: 'jutro',
                hour: '22:15',
                vehicle: 'Mercedes Sprinter (KR 193PK)',
                parking: 'Kraków, parking Czyżyny, ',
                parkingInfo: 'końcowy'
            }
        ]);
    }

    let results = [];
    if (direction >= 0) results = results.concat(ab);
    if (direction <= 0) results = results.concat(ba);

    res.ok(results.sort((a, b) =>
        (a.day == b.day)
        ? ((a.hour == b.hour) ? 0 : (a.hour > b.hour) ? 1 : -1)
        : ((a.day > b.day) ? 1 : -1)
    ));
});


module.exports = router;
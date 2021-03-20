const express = require('express');
const router = express.Router();
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


const bookings = new Map();
bookings.set('annanowak1234', [
    { route: { id: 1, name: 'Kraków-Katowice' }, driver: 'Tomasz Rajdowiec', date: '2020-07-04', time: '12:15' },
    { route: { id: 2, name: 'Katowice-Kraków' }, driver: 'Marek Poprawny', date: '2020-07-04', time: '18:00' }
]);


router.get('/bookings', [role('client')], (req, res) => {
    let { login } = req.user;

    if (bookings.has(login)) {
        res.ok(bookings.get(login));
    }
    else {
        res.ok([]);
    }
});


module.exports = router;
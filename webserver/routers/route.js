const express = require('express');
const router = express.Router();
const errors = require('../errors');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


const routes = [
    [1, 'Kraków-Katowice'],
    [2, 'Kraków-Warszawa']
];


router.get('/routes', (req, res) => {
    res.ok(routes);
});


module.exports = router;
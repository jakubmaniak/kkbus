const express = require('express');
const router = express.Router();
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


const drivers = [
    [9002, 'Tomasz Rajdowiec'],
    [9003, 'Kazimierz Rajdowiec'],
    [9004, 'Mirosław Szybki'],
    [9006, 'Jan Doświadzony'],
    [9007, 'Marek Poprawny'],
    [9009, 'Zuzanna Konkretna']
];


router.get('/drivers', (req, res) => {
    res.ok(drivers);
});


module.exports = router;
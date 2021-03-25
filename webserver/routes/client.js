const express = require('express');
const router = express.Router();

const { invalidRequest } = require('../errors');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);
const userController = require('../controllers/user');


router.get('/clients', [role('office')], async (req, res, next) => {
    //let { param, query } = req.params;
    let [[param, query]] = Object.entries(req.query);

    let availableParams = ['id', 'email', 'login', 'name', 'phone'];
    param = param.toLowerCase();
    query = query.trim();

    if (param != 'id' && query.length < 3) {
        return res.ok([]);
    }

    if (!availableParams.includes(param)) {
        return next(invalidRequest);
    }
    if (param == 'phone') param = 'phoneNumber';
    

    let clients = await userController.findManyUsers(param, query, 1);

    if (clients == null) return next(invalidRequest);
    res.ok(clients);
});


module.exports = router;
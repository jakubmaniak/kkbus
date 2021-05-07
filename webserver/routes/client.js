const express = require('express');
const router = express.Router();

const { invalidRequest, invalidValue } = require('../errors');
const { roles, minimumRole } = require('../middlewares/roles');
const userController = require('../controllers/user');


router.get('/clients', [minimumRole(roles.office)], async (req, res, next) => {
    if (!Object.entries(req.query).length) {
        return next(invalidRequest());
    }

    let [[param, query]] = Object.entries(req.query);

    let availableParams = ['id', 'email', 'login', 'name', 'phone'];
    param = param.toLowerCase();

    if (query instanceof Array) {
        return next(invalidValue());
    }

    query = query.trim();

    if (param != 'id' && query.length < 3) {
        return res.ok([]);
    }

    if (!availableParams.includes(param)) {
        return next(invalidRequest());
    }
    if (param == 'phone') param = 'phoneNumber';
    

    let clients = await userController.findManyUsers(param, query, 1);

    if (clients == null) return next(invalidRequest());
    res.ok(clients);
});


module.exports = router;
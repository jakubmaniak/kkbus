const express = require('express');
const router = express.Router();

const { serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const roles = new Map([
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
]);
const role = require('../middlewares/roles')(...roles);

const userController = require('../controllers/user');
const { selectProps, resolveRoles } = require('../helpers/query-utils');


router.get('/employees', [role('owner')], async (req, res, next) => {
    try {
        let employees = userController.findManyUsersByRole(2, 3, 4)
            .then(resolveRoles('role'));

        res.ok(await employees);
    }
    catch {
        next(serverError());
    }
});

router.get('/employees/drivers/names', async (req, res, next) => {
    try {
        let drivers = userController.findManyUsersByRole(2)
            .then(selectProps('id', 'firstName', 'lastName'));

        res.ok(await drivers);
    }
    catch {
        next(serverError());
    }
});


module.exports = router;
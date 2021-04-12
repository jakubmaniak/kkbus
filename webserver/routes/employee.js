const express = require('express');
const router = express.Router();

const { serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole, roles } = require('../middlewares/roles');
const { selectProps, resolveRoles } = require('../helpers/query-utils');

const userController = require('../controllers/user');


router.get('/employees', [minimumRole('owner')], async (req, res, next) => {
    try {
        let employeeRoles = [roles.driver.priority, roles.office.priority, roles.owner.priority];
        let employees = userController.findManyUsersByRole(employeeRoles)
            .then(resolveRoles('role'));

        res.ok(await employees);
    }
    catch {
        next(serverError());
    }
});

router.get('/employees/drivers/names', [minimumRole('driver')], async (req, res, next) => {
    try {
        let drivers = userController.findManyUsersByRole(roles.driver.priority)
            .then(selectProps('id', 'firstName', 'lastName'));

        res.ok(await drivers);
    }
    catch {
        next(serverError());
    }
});


module.exports = router;
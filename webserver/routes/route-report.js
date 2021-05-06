const express = require('express');
const router = express.Router();

const { invalidValue } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { roles, onlyRoles, roleDictionary } = require('../middlewares/roles');
const { parseDateTime } = require('../helpers/date');

const routeReportController = require('../controllers/route-report');
const vehicleController = require('../controllers/vehicle');
const routeController = require('../controllers/route');
const userController = require('../controllers/user');


router.post('/reports/route/:routeId', [
    onlyRoles('driver', 'owner'),
    bodySchema(`{
        stop: string,
        vehicleId: number,
        driverId?: number,
        amount: number
    }`)
], async (req, res, next) => {
    let routeId = parseInt(req.params.routeId, 10);
    if (isNaN(routeId)) return next(invalidValue());

    let driverId;
    if (req.user.role == roles.driver) {
        driverId = req.user.id;
    }
    else {
        driverId = req.body.driverId;
    }

    let { stop, vehicleId, amount } = req.body;
    
    if (amount < 0) {
        return next(invalidValue());
    }

    try {
        let [route, ] = await Promise.all([
            routeController.findRoute(routeId),
            vehicleController.findVehicle(vehicleId)
        ]);
        
        if (req.user.role == roles.owner) {
            let user = await userController.findUserById(driverId);

            if (roleDictionary.getRole(user.role) !== roles.driver) {
                throw invalidValue();
            }
        }

        if (!route.stops.includes(stop)) {
            throw invalidValue();
        }

        let result = await routeReportController.addReport({
            routeId,
            stop,
            vehicleId,
            driverId,
            date: parseDateTime(new Date()).toString(3),
            amount
        });

        res.ok({ id: result.insertId });
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
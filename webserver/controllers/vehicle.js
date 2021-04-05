let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

/*CREATE TABLE `VdWUtFNeZC`.`vehicles` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
    `state` TEXT NULL ,
    `brand` VARCHAR(50) NOT NULL ,
    `model` VARCHAR(60) NOT NULL , 
    `year` SMALLINT UNSIGNED NOT NULL , 
    `plate` VARCHAR(16) NULL , 
    `parking` TEXT NULL , 
    `routeId` INT UNSIGNED NULL,
    `seats` SMALLINT UNSIGNED NOT NULL , 
    `mileage` INT UNSIGNED NULL DEFAULT '0' , 
    PRIMARY KEY (`id`)
);*/

module.exports.addVehicle = (vehicle) => {
    return db.query('INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?,?)', [
        null,
        vehicle.state || null,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.plate || null,
        vehicle.parking || null,
        vehicle.routeId || null,
        vehicle.seats,
        vehicle.mileage || 0
    ]);
};

module.exports.findAllVehicles = () => {
    //return db.query('SELECT * FROM vehicles');
    return db.query(`SELECT vehicles.*, routes.departureLocation, routes.arrivalLocation
        FROM vehicles
        LEFT JOIN routes ON vehicles.routeId=routes.id`
    );
};

module.exports.findVehicle = (vehicleId) => {
    //return db.query('SELECT * FROM vehicles WHERE id=? LIMIT 1', [vehicleId])
    //    .then(getFirst);
    return db.query(`SELECT vehicles.*, routes.departureLocation, routes.arrivalLocation
        FROM vehicles
        LEFT JOIN routes ON vehicles.routeId=routes.id
        WHERE vehicles.id=?
        LIMIT 1`,
        [vehicleId]
    ).then(getFirst);
};

module.exports.updateVehicle = (vehicleId, vehicle) => {
    return db.query(`UPDATE vehicles
        SET state=?, brand=?, model=?, year=?, plate=?, parking=?, routeId=?, seats=?, mileage=?
        WHERE id=?`, [
            vehicle.state || null,
            vehicle.brand,
            vehicle.model,
            vehicle.year,
            vehicle.plate || null,
            vehicle.parking || null,
            vehicle.routeId || null,
            vehicle.seats,
            vehicle.mileage || 0,
            vehicleId
        ]
    );
};

module.exports.deleteVehicle = (vehicleId) => {
    return db.query(`DELETE FROM vehicles WHERE id=?`, [vehicleId]);
};
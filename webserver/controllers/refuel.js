let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

/*
CREATE TABLE `VdWUtFNeZC`.`refuels` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `vehicleId` INT NOT NULL , 
    `amount` FLOAT UNSIGNED NOT NULL , 
    `cost` FLOAT UNSIGNED NOT NULL , 
    `mileage` INT UNSIGNED NULL , 
    `date` DATETIME NOT NULL , 
    PRIMARY KEY (`id`)
);
*/

module.exports.addRefuel = (refuel) => {
    return db.query('INSERT INTO refuels VALUES (?,?,?,?,?,?)', [
        null,
        refuel.vehicleId,
        refuel.amount,
        refuel.cost,
        refuel.mileage || null,
        refuel.date.toString()
    ]);
};

module.exports.findVehicleRefuels = (vehicleId) => {
    return db.query('SELECT * FROM refuels WHERE vehicleId=? ORDER BY date DESC', [vehicleId]);
};
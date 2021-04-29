/*
CREATE TABLE `route_reports` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `routeId` INT NOT NULL , 
    `stop` VARCHAR(200) NOT NULL , 
    `vehicleId` INT NOT NULL , 
    `date` DATETIME NOT NULL , 
    `amount` INT NOT NULL ,
     PRIMARY KEY (`id`)
) ENGINE = InnoDB;
*/

let db = require('../configs/db');
let { getFirst, deleteProps, splitProps } = require('../helpers/query-utils');

module.exports.addReport = (report) => {
    return db.query('INSERT INTO route_reports VALUES (?,?,?,?,?,?)', [
        null,
        report.routeId,
        report.stop,
        report.vehicleId,
        report.date.toString(),
        report.amount
    ]);
};

module.exports.findAllReports = () => {
    return db.query('SELECT * FROM route_reports');
};
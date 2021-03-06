/*
CREATE TABLE `route_reports` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `routeId` INT NOT NULL , 
    `stop` VARCHAR(200) NOT NULL , 
    `vehicleId` INT NOT NULL , 
    `driverId` INT NOT NULL,
    `date` DATETIME NOT NULL , 
    `persons` INT UNSIGNED NOT NULL ,
    `income` INT UNSIGNED NOT NULL DEFAULT 0 ,
     PRIMARY KEY (`id`)
) ENGINE = InnoDB;
*/

let db = require('../configs/db');

module.exports.addReport = (report) => {
    return db.query('INSERT INTO route_reports VALUES (?,?,?,?,?,?,?,?)', [
        null,
        report.routeId,
        report.stop,
        report.vehicleId,
        report.driverId,
        report.date.toString(),
        report.persons,
        report.income
    ]);
};

module.exports.findAllReports = () => {
    return db.query('SELECT * FROM route_reports');
};

module.exports.findDailyReports = (routeId, vehicleId, driverId, date) => {
    return db.query(`
        SELECT *
        FROM route_reports
        WHERE routeId=? AND vehicleId=? AND driverId=? AND CAST(date AS DATE)=?`, [
            routeId,
            vehicleId,
            driverId,
            date?.toString()
        ]
    );
};

module.exports.findWeeklyReports = (routeId, vehicleId, driverId, year, week) => {
    return db.query(`
        SELECT *
        FROM route_reports
        WHERE routeId=? AND vehicleId=? AND driverId=? AND YEAR(date)=? AND WEEK(date)=?`, [
            routeId,
            vehicleId,
            driverId,
            year,
            week
        ]
    );
};

module.exports.findMonthlyReports = (routeId, vehicleId, driverId, year, month) => {
    return db.query(`
        SELECT *
        FROM route_reports
        WHERE routeId=? AND vehicleId=? AND driverId=? AND YEAR(date)=? AND MONTH(date)=?`, [
            routeId,
            vehicleId,
            driverId,
            year,
            month
        ]
    );
};

module.exports.findAnnualReports = (routeId, vehicleId, driverId, year) => {
    return db.query(`
        SELECT *
        FROM route_reports
        WHERE routeId=? AND vehicleId=? AND driverId=? AND YEAR(date)=?`, [
            routeId,
            vehicleId,
            driverId,
            year
        ]
    );
};
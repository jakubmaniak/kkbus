/*
CREATE TABLE `booking_reports` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `year` SMALLINT UNSIGNED NOT NULL , 
    `month` TINYINT UNSIGNED NOT NULL , 
    `realizedCount` INT UNSIGNED NULL , 
    `unrealizedCount` INT UNSIGNED NULL ,
    PRIMARY KEY (`id`)
);
*/

let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

module.exports.addBookingReport = (bookingReport) => {
    return db.query('INSERT INTO booking_reports VALUES (?,?,?,?,?)', [
        null,
        bookingReport.year,
        bookingReport.month,
        bookingReport.realizedCount,
        bookingReport.unrealizedCount
    ]);
};

module.exports.updateBookingReport = (bookingReportId, bookingReport) => {
    return db.query(`UPDATE booking_reports
        SET year=?, month=?, realizedCount=?, unrealizedCount=?
        WHERE id=?`, [
            bookingReport.year,
            bookingReport.month,
            bookingReport.realizedCount,
            bookingReport.unrealizedCount,
            bookingReportId
        ]
    );
};

module.exports.findBookingReportByMonth = (year, month) => {
    return db.query('SELECT * FROM booking_reports WHERE year=? AND month=?', [
        year,
        month
    ])
    .then(getFirst);
};

module.exports.findManyBookingReportsByYear = (year) => {
    return db.query('SELECT * FROM booking_reports WHERE year=?', [year]);
};

module.exports.groupBookingReportsByYear = (year) => {
    return db.query(`SELECT year, SUM(realizedCount) AS realizedCount, SUM(unrealizedCount) AS unrealizedCount
        FROM booking_reports
        WHERE year=?
        GROUP BY year`,
        [year]
    )
    .then(getFirst);
};
let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

/*
CREATE TABLE `VdWUtFNeZC`.`bookings` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `userId` INT NOT NULL , 
    `hour` VARCHAR(8) NOT NULL , 
    `normalTickets` TINYINT UNSIGNED NOT NULL , 
    `reducedTickets` TINYINT UNSIGNED NOT NULL , 
    `childTickets` TINYINT UNSIGNED NOT NULL , 
    `routeId` INT NOT NULL , 
    `firstStop` TEXT NOT NULL , 
    `lastStop` TEXT NOT NULL , 
    `price` FLOAT UNSIGNED NOT NULL , 
    PRIMARY KEY (`id`)
);
*/

module.exports.addBooking = (booking) => {
    return db.query('INSERT INTO bookings VALUES (?,?,?,?,?,?,?,?,?,?)', [
        null,
        booking.userId,
        booking.hour,
        booking.normalTickets,
        booking.reducedTickets,
        booking.childTickets,
        booking.routeId,
        booking.firstStop,
        booking.lastStop,
        booking.price
    ]);
};

module.exports.findAllBookings = () => {
    return db.query('SELECT * FROM bookings');
};

module.exports.findUserBookings = (userId) => {
    return db.query('SELECT * FROM bookings WHERE userId=?', [userId]);
};

module.exports.findBooking = (bookingId) => {
    return db.query('SELECT * FROM bookings WHERE id=? LIMIT 1', [bookingId])
        .then(getFirst);
};

module.exports.updateBooking = (bookingId, booking) => {
    return db.query(`UPDATE bookings
        SET hour=?, normalTickets=?, reducedTickets=?, childTickets=?, routeId=?, firstStop=?, lastStop=?, price=?
        WHERE id=?`, [
            booking.hour,
            booking.normalTickets,
            booking.reducedTickets,
            booking.childTickets,
            booking.routeId,
            booking.firstStop,
            booking.lastStop,
            booking.price,
            bookingId
        ]
    );
};

module.exports.deleteBooking = (bookingId, userId = null) => {
    if (userId == null) {
        return db.query('DELETE FROM bookings WHERE id=?', [bookingId]);
    }
    else {
        return db.query('DELETE FROM bookings WHERE id=? AND userId=?', [bookingId, userId]);
    }
};
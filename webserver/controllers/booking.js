let mailer = require('../configs/mail');
let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

/*
CREATE TABLE `VdWUtFNeZC`.`bookings` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `userId` INT NOT NULL , 
    `date` VARCHAR(10) NOT NULL ,
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

module.exports.sendBookingConfirmation = (email, booking) => {
    return mailer.sendMail(
        email,
        'KKBus - Potwierdzenie rezerwacji',
        `<p>Złożono rezerwację <b>${booking.firstStop} - ${booking.lastStop}</b> na dzień <b>${booking.date}</b> o godzinie <b>${booking.hour}</b></p>`
    );
};

module.exports.sendBookingReminder = (email, booking) => {
    return mailer.sendMail(
        email,
        'KKBus - Przypomnienie o rezerwacji',
        `<p>Przypomnienie o Twojej rezerwacji na trasie <b>${booking.firstStop} - ${booking.lastStop}</b> w dniu <b>${booking.date}</b> o godzinie <b>${booking.hour}</b></p>`
    );
};

module.exports.sendBookingCancellation = (email, booking) => {
    return mailer.sendMail(
        email,
        'KKBus - Odwołanie rezerwacji',
        `<p>Odwołano rezerwację <b>${booking.firstStop} - ${booking.lastStop}</b> z dnia <b>${booking.date}</b> o godzinie <b>${booking.hour}</b></p>`
    );
};

module.exports.addBooking = (booking) => {
    return db.query('INSERT INTO bookings VALUES (?,?,?,?,?,?,?,?,?,?,?)', [
        null,
        booking.userId,
        booking.date,
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
    return db.query(`SELECT bookings.*, users.firstName, users.lastName
        FROM bookings
        JOIN users ON bookings.userId = users.id`);
};

module.exports.findManyBookings = (bookingIds) => {
    return db.query(`SELECT * FROM bookings WHERE id IN ?`, [[bookingIds]]);
}

module.exports.findUserBookingsByRoute = (routeId, date, hour) => {
    return db.query(`SELECT bookings.*, firstName, lastName
        FROM bookings
        INNER JOIN users
        ON bookings.userId=users.id
        WHERE routeId=? AND hour=? AND date=?`, [
            routeId,
            hour,
            date
        ]);
};

module.exports.findUserBookings = (userId) => {
    return db.query('SELECT * FROM bookings WHERE userId=? ORDER BY date DESC, hour DESC', [userId]);
};

module.exports.findUserBookingsBeforeDate = (userId, date, hour) => {
    return db.query(`SELECT * FROM bookings
        WHERE userId=? AND (date < ? OR (date=? AND hour <= ?))
        ORDER BY date DESC, hour DESC`, [
            userId, date, date, hour
        ]);
};

module.exports.findUserBookingsAfterDate = (userId, date, hour) => {
    return db.query(`SELECT * FROM bookings
        WHERE userId=? AND (date > ? OR (date=? AND hour > ?))
        ORDER BY date ASC, hour ASC`, [
            userId, date, date, hour
        ]);
};

module.exports.findBooking = (bookingId) => {
    return db.query('SELECT * FROM bookings WHERE id=? LIMIT 1', [bookingId])
        .then(getFirst);
};

module.exports.updateBooking = (bookingId, booking) => {
    return db.query(`UPDATE bookings
        SET date=?, hour=?, normalTickets=?, reducedTickets=?, childTickets=?, routeId=?, firstStop=?, lastStop=?, price=?
        WHERE id=?`, [
            booking.date,
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
const { parseDateTime, parseDate, parseTime } = require('../helpers/date');
const bookingController = require('../controllers/booking');
const userController = require('../controllers/user');
const nth = require('../helpers/nth');

class BookingRemainder {
    constructor() {
        this.queue = new Map();
        this.today = parseDate(Date.now() + 24 * 3600 * 1000).toString();
        this.counter = 0;

        this.loadTomorrowBookings().then(() => {
            setInterval(this.check.bind(this), 30 * 1000);
        });
    }

    async loadTomorrowBookings() {
        let bookings = await bookingController.findAllBookings();
        let tomorrow = parseDateTime(Date.now() + 24 * 3600 * 1000).toString();

        for (let booking of bookings) {
            if (booking.date + ' ' + booking.hour > tomorrow) {
                this.addBooking(booking);
            }
        }

        this.check();
    }

    check() {
        console.log(`The booking remainder queue has been checked ${nth(++this.counter)} time.`);

        let today = parseDate(Date.now()).toString();

        if (today != this.today) {
            this.today = today;
            this.queue.clear();

            this.loadTomorrowBookings();
            return;
        }        

        let currentHour = parseTime(new Date()).toString();
        // 06:00 UTC == 08:00 GMT+2 == 08:00 CEST == 07:00 CET
        if (currentHour != '06:00') {
            return;
        }

        let tomorrow = parseDate(Date.now() + 24 * 3600 * 1000).toString();

        for (let booking of this.queue.values()) {
            if (booking.date === tomorrow) {
                this.sendRemainder(booking);
                this.deleteBooking(booking);
            }
        }
    }

    async sendRemainder(booking) {
        try {
            let user = await userController.findUserById(booking.userId);
            await bookingController.sendBookingReminder(user.email, booking);
            console.log(`A #${booking.id} booking remainder has been sent.`);
        }
        catch (err) {
            console.log(`An error occured while sending #${booking.id} remainder.`);
            console.error(err);
        }
    }

    addManyBookings(bookings) {
        for (let booking of bookings) {
            this.addBooking(booking);
        }
    }

    addBooking(booking) {
        this.queue.set(booking.id, booking);
    }

    deleteBooking(booking) {
        this.queue.delete(booking.id);
    }

    deleteBookingById(bookingId) {
        this.queue.delete(bookingId);
    }
}

module.exports = new BookingRemainder();
import axios from 'axios';
import toast from './helpers/toast';

const errorMessages = new Map(Object.entries({
    axios_connection:       'Błąd połączenia',
    server_error:           'Błąd serwera',
    invalid_request:        'Błędny format żądania',
    not_found:              'Nie znaleziono',
    unauthorized:           'Niewystarczające uprawnienia',
    bad_session_token:      'Niepoprawny lub nieważny identyfikator sesji',
    invalid_value:          'Wprowadzona wartość jest niedozwolona lub niepoprawna',
    not_enough:             'Niewystarczająca ilość',
    too_late:               'Za późno',
    bad_credentials:        'Niepoprawny login lub hasło',
    email_already_taken:    'Konto o tym adresie e-mail już istnieje',
    booking_locked:         'Możliwość rezerwacji została zablokowana na miesiąc'
}));

export function errorToString(err) {
    if (!errorMessages.has(err.message)) {
        console.warn(err);
        return 'Nieokreślony błąd #' + err.name;    
    }

    return errorMessages.get(err.message);
}

export function toastifyError(err) {
    toast.error(errorToString(err));
}

const root = '/api';

export async function login(login, password) {
    return sendPost('/user/login', { login, password });
}

export async function logout() {
    return sendGet('/user/logout');
}

export async function register(email, firstName, lastName, birthDate, phoneNumber) {
    return sendPost('/user/register', { email, firstName, lastName, birthDate, phoneNumber });
}

/**
 * `PATCH /api/user/password` Change the user password
 * @async
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns Promise of object where the result is null
 */
export async function updateUserPassword(currentPassword, newPassword) {
    return sendPatch('/user/password', { currentPassword, newPassword })
}

export async function getUserInfo() {
    return sendGet('/user/info');
}

export async function getUserProfile() {
    return sendGet('/user/profile');
}

/**
 * `PATCH /api/user/profile` Change the user personal data
 * @async
 * @param {object} user
 * @param {string} [user.firstName]
 * @param {string} [user.lastName]
 * @param {string} [user.birthDate]
 * @param {string} [user.login]
 * @param {string} [user.email]
 * @param {string} [user.phoneNumber]
 * @return Promise of object where the result is null. Generates a new session token and passes its in a cookie if login is given.
 */
export async function updateUserProfile({ firstName = null, lastName = null, birthDate = null, login = null, email = null, phoneNumber = null }) {
    return sendPatch('/user/profile', { firstName, lastName, birthDate, login, email, phoneNumber })
}


export async function getAllRoutes() {
    return sendGet('/routes');
}

export async function getRoute(routeId) {
    return sendGet('/route/' + routeId);
}

export async function addRoute(departureLocation, arrivalLocation, stops = null, hours = null, prices = null, oppositeId = null) {
    return sendPost('/route', { departureLocation, arrivalLocation, stops, hours, prices, oppositeId });
}

export async function updateRoute(routeId, departureLocation, arrivalLocation, stops = null, hours = null, prices = null, oppositeId = null) {
    return sendPut('/route/' + routeId, { departureLocation, arrivalLocation, stops, hours, prices, oppositeId });
}

export async function deleteRoute(routeId) {
    return sendDelete('/route/' + routeId);
}

/**
 * `POST /api/reports/route/:routeId` Add a route report
 * @async
 * @param {number} routeId
 * @param {string} stop
 * @param {number} vehicleId
 * @param {number} noBookingPersons
 * @param {[{id: number, realized: boolean}]} [bookings]
 * @param {number} [driverId]
 * @return Promise that returns id of added report.
 */
export async function addRouteReport(routeId, stop, vehicleId, noBookingPersons, bookings = [], driverId = null) {
    return sendPost('/reports/route/' + routeId, { stop, vehicleId, noBookingPersons, bookings, driverId });
}


export async function getUserBookings() {
    return sendGet('/bookings');
}

export async function getUserPastBookings() {
    return sendGet('/bookings/past');
}

export async function getUserFutureBookings() {
    return sendGet('/bookings/future');
}

export async function addBooking(routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop) {
    return sendPost('/booking', { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop });
}


/**
 * `DELETE /api/booking/:bookingId` Delete the booking using its id
 * @async
 * @param {number} bookingId
 * @return Promise.
 */
export async function deleteBooking(bookingId) {
    return sendDelete('/booking/' + bookingId);
}

export async function addBookingToUser(userId, routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop) {
    return sendPost('/booking/' + userId, { routeId, date, hour, normalTickets, reducedTickets, childTickets, firstStop, lastStop });
}

export async function getRouteBookings(routeId, date, hour) {
    return sendGet(`/bookings/${routeId}/${date}/${hour}`);
}


export async function getAllVehicles() {
    return sendGet('/vehicles');
}

export async function getVehicle(vehicleId) {
    return sendGet('/vehicle/' + vehicleId);
}

export async function addVehicle(brand, model, year, seats, plate = null, mileage = null, state = null, parking = null, routeIds = null) {
    return sendPost('/vehicle', { brand, model, year, seats, plate, mileage, state, parking, routeIds });
}

export async function updateVehicle(vehicleId, brand, model, year, seats, plate = null, mileage = null, state = null, parking = null, routeIds = null) {
    return sendPut('/vehicle/' + vehicleId, { brand, model, year, plate, mileage, seats, state, parking, routeIds });
}

export async function deleteVehicle(vehicleId) {
    return sendDelete('/vehicle/' + vehicleId);
}

export async function getRefuels(vehicleId) {
    return sendGet(`/vehicle/${vehicleId}/refuels`);
}

export async function addRefuel(vehicleId, amount, cost, mileage = null) {
    return sendPost(`/vehicle/${vehicleId}/refuel`, { amount, cost, mileage });
}


export async function getClients(param, query) {
    return sendGet(`/clients?${param}=${query}`);
}


export async function getEmployees() {
    return sendGet('/employees');
}

export async function getDriverNames() {
    return sendGet('/employees/drivers/names');
}


export async function getWorkSchedule(driverId, range = 0, routeId = null) {
    return sendPost('/work-schedule', { driverId, range, routeId } );
}


export async function getTimetable(date = null) {
    if (date) {
        return sendGet('/timetable/' + date);
    }
    else {
        return sendGet('/timetable');
    }
}

export async function addTimetableItem(startDate, days, ranges, available, label = null) {
    return sendPost('/timetable', { startDate, days, ranges, available, label });
}

export async function addTimetableItemToUser(userId, startDate, days, ranges, available, label = null) {
    return sendPost('/timetable/' + userId, { startDate, days, ranges, available, label });
}

export async function updateTimetableItem(itemId, startDate, days, ranges, available, label = null) {
    return sendPut('/timetable/' + itemId, { startDate, days, ranges, available, label });
}

export async function deleteTimetableItem(itemId) {
    return sendDelete('/timetable/' + itemId);
}


export async function getLoyaltyProgram() {
    return sendGet('/loyalty-program');
}

export async function getAllRewards() {
    return sendGet('/loyalty-program/rewards');
}

export async function getUserRewardOrders() {
    return sendGet('/loyalty-program/orders');
}

export async function buyReward(rewardId) {
    return sendPost('/loyalty-program/order/' + rewardId);
}

export async function addReward(name, requiredPoints, amount = null, limit = null) {
    return sendPost('/loyalty-program/reward', { name, requiredPoints, amount, limit });
}

export async function updateReward(rewardId, name, requiredPoints, amount = null, limit = null) {
    return sendPut('/loyalty-program/reward/' + rewardId, { name, requiredPoints, amount, limit });
}

export async function deleteReward(rewardId) {
    return sendDelete('/loyalty-program/reward/' + rewardId);
}


export async function getContact() {
    return sendGet('/contact');
}

export async function updateContact(address, zipCode, email, phoneNumber, faxNumber = null) {
    return sendPut('/contact', { address, zipCode, email, phoneNumber, faxNumber });
}


async function send(method, path, body = undefined) {
    let res = await axios({
        method,
        url: root + path,
        data: body
    })
    .catch((err) => {
        console.error(err);
        throw new Error('connection_error');
    });

    if (res.data.error) {
        throw new Error(res.data.errorCode);
    }

    return res.data.result;
}

async function sendGet(path) {
    return send('GET', path);
}

async function sendPost(path, body) {
    return send('POST', path, body);
}

async function sendPut(path, body) {
    return send('PUT', path, body);
}

async function sendPatch(path, body) {
    return send('PATCH', path, body);
}

async function sendDelete(path) {
    return send('DELETE', path);
}
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
    out_of_stock:           'W magazynie nie ma już nagród',
    limit_reached:          'Osiągnięto limit zakupionych nagród',
    too_late:               'Za późno',
    bad_credentials:        'Niepoprawny login lub hasło',
    email_already_taken:    'Konto o tym adresie e-mail już istnieje',
    login_already_taken:    'Wprowadzony login jest już zajęty',
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
 * `POST /api/user/activate` Active the user account
 * @param {string} activationCode 
 * @returns Promise. Generates a new session token cookie.
 */
export async function activateUserAccount(activationCode) {
    return sendPost('/user/activate', { activationCode });
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

/**
 * `POST /api/route Add route
 * @async
 * @param {number} routeId 
 * @param {string} departureLocation 
 * @param {string} arrivalLocation 
 * @param {string[]} [stops] 
 * @param {string[]} [hours] 
 * @param {number[]} [prices] 
 * @param {number[]} [distances] 
 * @param {number} [oppositeId]
 * @returns Promise that returns an added route object.
 */
export async function addRoute(departureLocation, arrivalLocation, stops = null, hours = null, prices = null, distances = null, oppositeId = null) {
    return sendPost('/route', { departureLocation, arrivalLocation, stops, hours, prices, distances, oppositeId });
}

/**
 * `PUT /api/route/:routeId` Update route
 * @async
 * @param {number} routeId 
 * @param {string} departureLocation 
 * @param {string} arrivalLocation 
 * @param {string[]} [stops] 
 * @param {string[]} [hours] 
 * @param {number[]} [prices] 
 * @param {number[]} [distances] 
 * @param {number} [oppositeId]
 * @returns Promise that returns an updated route object.
 */
export async function updateRoute(routeId, departureLocation, arrivalLocation, stops = null, hours = null, prices = null, distances = null, oppositeId = null) {
    return sendPut('/route/' + routeId, { departureLocation, arrivalLocation, stops, hours, prices, distances, oppositeId });
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

/**
 * `GET /api/reports/route/:routeId/:vehicleId/:driverId/:type/:range` Get route reports
 * @param {number} routeId 
 * @param {number} vehicleId 
 * @param {number} driverId 
 * @param {"daily" | "weekly" | "monthly" | "annual"} type 
 * @param {string} range 
 * - Allowed formats:
 * - date: `2021-12-31`
 * - month: `2021-12`
 * - week: `2021-W25`
 * - year: `2021`
 * @returns Promise that returns array of stops and number of persons.
 */
export async function getRouteReports(routeId, vehicleId, driverId, type, range) {
    return sendGet(`/reports/route/${routeId}/${vehicleId}/${driverId}/${type}/${range}`);
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


/**
 * `GET /api/booking-reports/:year` Get many booking reports in the given year
 * @async
 * @param {number} year 
 * @returns Promise that returns array of monthly booking reports.
 */
export async function getManyBookingReportsByYear(year) {
    return sendGet('/booking-reports/' + year);
}

/**
 * `GET /api/booking-report/:year` Get annual booking report
 * @async
 * @param {number} year 
 * @returns Promise that returns annual booking reports.
 */
export async function getBookingReportByYear(year) {
    return sendGet('/booking-report/' + year);
}

/**
 * `GET /api/booking-report/:year/:month` Get monthly booking report
 * @async
 * @param {number} year 
 * @param {number} month
 * @returns Promise that returns monthly booking report.
 */
export async function getBookingReportByMonth(year, month) {
    return sendGet(`/booking-report/${year}/${month}`);
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

export async function getEmployeeNames() {
    return sendGet('/employees/names');
}

export async function getDriverNames() {
    return sendGet('/employees/drivers/names');
}


/**
 * `GET /api/work-schedule` Get today work schedule events \
 * `GET /api/work-schedule/:date` Get events in given day \
 * `GET /api/work-schedule/:startDate/:endDate` Get events between given days
 * @async
 * @param {string} [startDate]
 * @param {string} [endDate] 
 * @returns Promise that returns array of events
 */
export async function getWorkSchedule(startDate = null, endDate = null) {
    if (startDate === null) {
        return sendGet('/work-schedule');
    }
    else if (endDate === null) {
        return sendGet('/work-schedule/' + startDate);
    }
    return sendGet(`/work-schedule/${startDate}/${endDate}`);
}

/**
 * `POST /api/work-schedule` Add a work schedule event
 * @param {number} employeeId 
 * @param {string} date 
 * @param {string} startHour 
 * @param {string} endHour 
 * @param {string} label 
 * @param {number} [vehicleId]
 * @param {number} [routeId]
 * @param {string} [parking]
 * @returns Promise that returns id of the added event
 */
export async function addWorkScheduleEvent(employeeId, date, startHour, endHour, label, vehicleId = null, routeId = null, parking = null) {
    return sendPost('/work-schedule', { employeeId, date, startHour, endHour, label, vehicleId, routeId, parking });
}

/**
 * `DELETE /api/work-schedule/:eventId` Delete a work schedule event
 * @param {number} eventId 
 * @returns Promise
 */
export async function deleteWorkScheduleEvent(eventId) {
    return sendDelete('/work-schedule/' + eventId);
}

/**
 * `PATCH /api/work-schedule/:eventId` Update a work schedule event
 * @param {number} eventId 
 * @param {object} properties 
 * @param {string} [properties.startHour]
 * @param {string} [properties.endHour]
 * @param {string} [properties.label]
 * @param {number} [properties.vehicleId]
 * @param {number} [properties.routeId]
 * @param {string} [properties.parking]
 * @returns Promise
 */
export async function updateWorkScheduleEvent(eventId, properties) {
    return sendPatch('/work-schedule/' + eventId, properties);
}


/**
 * `GET /api/availability` Get today availability entities \
 * `GET /api/availability/:date` Get availability entities in given day \
 * `GET /api/availability/:startDate/:endDate` Get availability entities between given days
 * @async
 * @param {string} [startDate]
 * @param {string} [endDate] 
 * @returns Promise that returns array of entities
 */
 export async function getAvailabilityEntities(startDate = null, endDate = null) {
    if (startDate === null) {
        return sendGet('/availability');
    }
    else if (endDate === null) {
        return sendGet('/availability/' + startDate);
    }
    return sendGet(`/availability/${startDate}/${endDate}`);
}

/**
 * `POST /api/availability` Add an availability entity
 * @param {number} employeeId 
 * @param {string} date 
 * @param {string} startHour 
 * @param {string} endHour 
 * @param {boolean} available
 * @returns Promise that returns id of the added entity
 */
export async function addAvailabilityEntity(employeeId, date, startHour, endHour, available) {
    return sendPost('/availability', { employeeId, date, startHour, endHour, available });
}

/**
 * `DELETE /api/availability/:eventId` Delete an availability entity
 * @param {number} entityId 
 * @returns Promise
 */
export async function deleteAvailabilityEntity(entityId) {
    return sendDelete('/availability/' + entityId);
}

/**
 * `PATCH /api/availability/:entityId` Update an availability entity
 * @param {number} entityId 
 * @param {object} properties 
 * @param {string} [properties.startHour]
 * @param {string} [properties.endHour]
 * @param {boolean} [properties.available]
 * @returns Promise
 */
export async function updateAvailabilityEntity(entityId, properties) {
    return sendPatch('/availability/' + entityId, properties);
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
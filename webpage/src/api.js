import axios from 'axios';

const errorMessages = new Map(Object.entries({
    'bad_credentials': 'Niepoprawny login lub hasło',
    'axios_error': 'Błąd połączenia lub serwera'
}));

export function errorToString(err) {
    if (!errorMessages.has(err.message)) {
        console.warn(err);
        return 'Nieokreślony błąd #' + err.name;    
    }

    return errorMessages.get(err.message);
}

export function errorAlert(err) {
    alert(errorToString(err));
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

export async function getUserInfo() {
    return sendGet('/user/info');
}

export async function getAllVehicles() {
    return sendGet('/vehicles');
}

export async function getVehicle(vehicleId) {
    return sendGet('/vehicle/' + vehicleId);
}

export async function addVehicle(name, plate, mileage, seats, state = null, parking = null, ab = null, ba = null, driver = null) {
    return sendPost('/vehicle', { name, plate, mileage, seats, state, parking, ab, ba, driver });
}

export async function updateVehicle(vehicleId, name, plate, mileage, seats, state = null, parking = null, ab = null, ba = null, driver = null) {
    return sendPut('/vehicle/' + vehicleId, { name, plate, mileage, seats, state, parking, ab, ba, driver });
}

export async function deleteVehicle(vehicleId) {
    return sendDelete('/vehicle/' + vehicleId);
}

export async function getFuelUsage(vehicleId) {
    return sendGet(`/vehicle/${vehicleId}/fuel-usage`);
}

export async function getDrivers() {
    return sendGet('/drivers');
}

export async function getRoutes() {
    return sendGet('/routes');
}

export async function getWorkSchedule(driverId, range = 0, routeId = null, direction = 0) {
    return sendPost('/work-schedule', { driverId, range, routeId, direction } );
}

export async function getLoyaltyProgram() {
    return sendGet('/loyalty-program');
}

export async function getAllRewards() {
    return sendGet('/loyalty-program/rewards');
}

export async function buyReward(rewardId) {
    return sendGet('/loyalty-program/reward/' + rewardId);
}

export async function addReward(name, requiredPoints, amount = 0, limit = 0) {
    return sendPost('/loyalty-program/reward', { name, requiredPoints, amount, limit });
}

export async function updateReward(rewardId, name, requiredPoints, amount = 0, limit = 0) {
    return sendPut('/loyalty-program/reward/' + rewardId, { name, requiredPoints, amount, limit });
}

export async function deleteReward(rewardId) {
    return sendDelete('/loyalty-program/reward/' + rewardId);
}


async function sendGet(path) {
    let res = await axios.get(root + path)
    .catch((err) => {
        console.error(err);
        throw new Error('axios_error');
    });

    if (res.data.error) {
        throw new Error(res.data.errorCode);
    }

    return res.data.result;
}

async function sendPost(path, body) {
    let res = await axios.post(root + path, body)
    .catch((err) => {
        console.error(err);
        throw new Error('axios_error');
    });

    if (res.data.error) {
        throw new Error(res.data.errorCode);
    }

    return res.data.result;
}

async function sendPut(path, body) {
    let res = await axios.put(root + path, body)
    .catch((err) => {
        console.error(err);
        throw new Error('axios_error');
    });

    if (res.data.error) {
        throw new Error(res.data.errorCode);
    }

    return res.data.result;
}

async function sendDelete(path) {
    let res = await axios.delete(root + path)
    .catch((err) => {
        console.error(err);
        throw new Error('axios_error');
    });

    if (res.data.error) {
        throw new Error(res.data.errorCode);
    }

    return res.data.result;
}
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

async function post(path, body) {
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

async function get(path) {
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

export async function login(login, password) {
    return post('/login', { login, password });
}

export async function logout() {
    return get('/logout');
}

export async function register(email, firstName, lastName, birthDate, phoneNumber) {
    return post('/register', { email, firstName, lastName, birthDate, phoneNumber });
}

export async function getUserInfo() {
    return get('/user/info');
}

export async function getFuelUsage(vehicleId = null) {
    return post('/vehicle/fuel-usage', { vehicleId });
}
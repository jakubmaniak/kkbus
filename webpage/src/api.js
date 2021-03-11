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

export async function login(login, password) {
    return post('/login', { login, password });
}
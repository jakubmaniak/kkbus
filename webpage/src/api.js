import axios from 'axios';

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
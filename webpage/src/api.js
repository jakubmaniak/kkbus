import axios from 'axios';

const root = '/api';

async function post(path, body) {
    try {
        let res = await axios.post(root + path, body);

        if (res.data.error) {
            throw new Error(res.data.errorCode);
        }

        return res.data.result;
    }
    catch (err) {
        console.error(err);
        throw new Error('axios_error');
    }
}

export async function login(login, password) {
    return post('/login', { login, password });
}
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const reqValidator = require('./req-validator');
const errors = require('./error-codes');

const config = JSON.parse(fs.readFileSync('config.json'));

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(reqValidator.validate());
app.use((req, res, next) => {
    res.ok = (result = null) => res.json({ error: false, result });
    next();
});

const error = (errorCode) => {
    let err = new Error(errorCode);
    err.name = 'HandlerError';
    return err;
};


const users = new Map();
users.set('admin', 'admin');



reqValidator.addSchema('/api/login', '{login: string, password: string}');
app.post('/api/login', (req, res) => {
    let { login, password } = req.body;
    let username = login; //NOTE: login = username || e-mail address

    if (!users.has(username) || users.get(username) !== password) {
        throw error(errors.badCredentials);
    }

    res.ok();
});



reqValidator.addSchema('/api/register', '{email: string, password: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}');
app.post('/api/register', (req, res) => {
    let { email, password, firstName, lastName, birthDate, phoneNumber } = req.body;

    //NOTE: username cannot contain '@'

    //if (users.has(username)) throw error(errors.userAlreadyExists);
    //if (password !== repeatedPassword) throw error(errors.passwordsNotSame);

    users.set(email, password);

    res.ok();
});



app.use((err, req, res, next) => {
    let errorCode = err.message;

    if (err.message == 'invalid_request') {
        errorCode = errors.badRequest;
    }
    else if (err.name != 'HandlerError') {
        errorCode = errors.serverError;
        console.error(err);
    }

    res.json({ error: true, errorCode });
});

app.listen(config.server.port, config.server.host, () => {
    console.log(`Listening on ${config.server.host}:${config.server.port}...`);
});
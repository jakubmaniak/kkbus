const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const jwt = require('jsonwebtoken');

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
users.set('admin', {
    email: 'admin@kkbus.pl',
    login: 'admin',
    password: 'admin',
    firstName: 'Adam',
    lastName: 'Minowski',
    birthDate: '01-01-1999',
    phoneNumber: '123456789'
});

const usersByEmail = new Map();
usersByEmail.set('admin@kkbus.pl', users.get('admin'));


reqValidator.addSchema('/api/login', '{login: string, password: string}');
app.post('/api/login', (req, res) => {
    let { login, password } = req.body;

    if (!users.has(login) && !usersByEmail.has(login)) {
        throw error(errors.badCredentials);
    }

    let user;

    if (users.has(login)) {
        user = users.get(login);
    }
    else if (usersByEmail.has(login)) {
        user = usersByEmail.get(login);
        login = user.login;
    }
    else {
        throw error(errors.badCredentials);
    }
    
    if (user.password !== password) {
        throw error(errors.badCredentials);
    }

    let sessionToken = jwt.sign({ login }, 'KKBus-secret-random-words-FORest-APPle-PIe', { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({ sessionToken });
});


reqValidator.addSchema('/api/register', '{email: string, password: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}');
app.post('/api/register', (req, res) => {
    let { email, password, firstName, lastName, birthDate, phoneNumber } = req.body;

    if (usersByEmail.has(email)) throw error(errors.emailAlreadyTaken);
    
    //NOTE: check if birthDate and phoneNumber are valid

    let offset = 0;
    let phoneNumberPart = parseInt(phoneNumber.slice(-4));
    let login = firstName.toLowerCase() + lastName.toLowerCase();
    
    while (users.has(login + (phoneNumberPart + offset))) {
        offset++;
    }

    login += (phoneNumberPart + offset);

    let user = {
        email, login, password,
        firstName, lastName,
        birthDate,
        phoneNumber
    };
    usersByEmail.set(email, user);
    users.set(login, user);

    let sessionToken = jwt.sign({ login }, 'KKBus-secret-random-words-FORest-APPle-PIe', { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({ sessionToken, login });
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
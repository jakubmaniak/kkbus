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
    res.ok = (data = null) => res.json({ error: false, data });
    next();
});

const error = (errorCode) => {
    let err = new Error(errorCode);
    err.name = 'HandlerError';
    return err;
};


const users = new Map();
users.set('admin', 'admin');



reqValidator.addSchema('/api/login', '{username: string, password: string}');
app.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    if (!users.has(username) || users.get(username) !== password) {
        throw error(errors.badCredentials);
    }

    res.ok();
});



reqValidator.addSchema('/api/register', '{username: string, password: string, repeatedPassword: string}');
app.post('/api/register', (req, res) => {
    let { username, password, repeatedPassword } = req.body;

    if (users.has(username)) throw error(errors.userAlreadyExists);
    if (password !== repeatedPassword) throw error(errors.passwordsNotSame);

    users.set(username, password);

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
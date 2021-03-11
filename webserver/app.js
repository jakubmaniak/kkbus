const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const reqValidator = require('./req-validator');
const { error, errors } = require('./errors');

const config = JSON.parse(fs.readFileSync('config.json'));

const app = express();
app.set('etag', false);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.user = {
        loggedIn: false
    };

    if (req.cookies.session) {
        let payload;
        try {
            payload = jwt.verify(req.cookies.session, config.jwtSecret, { algorithms: ['HS512'] });
        }
        catch {
            throw error(errors.badSessionToken);
        }

        if (payload && payload.login) {
            req.user = {
                loggedIn: true,
                ...users.get(payload.login)
            };
        }
        else throw error(errors.badSessionToken);
    }

    next();
});
app.use(reqValidator.validate());
app.use((req, res, next) => {
    res.ok = (result = null) => res.json({ error: false, result });
    next();
});


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

const bookings = new Map();
bookings.set('admin', [
    { route: { id: 1, name: 'Kraków-Katowice' }, driver: 'Robert Busica', date: '2020-07-04', time: '12:15' },
    { route: { id: 2, name: 'Katowice-Kraków' }, driver: 'Krzysztof Kołowczyc', date: '2020-07-04', time: '18:00' }
]);


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

    let sessionToken = jwt.sign({ login }, config.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

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

    let sessionToken = jwt.sign({ login }, config.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({ sessionToken, login });
});

reqValidator.setProtected('/api/logout');
app.get('/api/logout', (req, res) => {
    if (!req.user.loggedIn) throw error(errors.unauthorized);

    res.header('Cache-Control', 'no-cache');
    res.clearCookie('session');
    res.ok();
});

reqValidator.setProtected('/api/bookings');
app.get('/api/bookings', (req, res) => {
    let { loggedIn, login } = req.user;

    if (!loggedIn) throw error(errors.unauthorized);

    res.ok(bookings.get(login));
});


app.use((err, req, res, next) => {
    let errorCode = err.message;

    if (err.name != 'HandlerError') {
        errorCode = errors.serverError;
        console.error(err);
    }

    res.json({ error: true, errorCode });
});

app.listen(config.server.port, config.server.host, () => {
    console.log(`Listening on ${config.server.host}:${config.server.port}...`);
});
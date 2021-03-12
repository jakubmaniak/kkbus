const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const reqValidator = require('./req-validator');
const errors = require('./errors');

const config = JSON.parse(fs.readFileSync('config.json'));

const app = express();
app.set('etag', false);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.user = {
        loggedIn: false,
        role: 'guest'
    };

    if (req.cookies.session) {
        let payload;
        try {
            payload = jwt.verify(req.cookies.session, config.jwtSecret, { algorithms: ['HS512'] });
        }
        catch {
            errors.badSessionToken();
        }

        if (payload && payload.login) {
            req.user = {
                loggedIn: true,
                ...users.get(payload.login)
            };
        }
        else errors.badSessionToken();
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
    id: 9001,
    email: 'admin@kkbus.pl',
    login: 'admin',
    password: 'admin',
    firstName: 'Jan',
    lastName: 'Kowalski',
    birthDate: '01-01-1999',
    phoneNumber: '123456789',
    role: 'owner'
});
users.set('trajdowiec', {
    id: 9434,
    email: 'trajdowiec@kkbus.pl',
    login: 'trajdowiec',
    password: 'haslo',
    firstName: 'Tomasz',
    lastName: 'Rajdowiec',
    birthDate: '01-01-1999',
    phoneNumber: '103406709',
    role: 'driver'
});
users.set('amila', {
    id: 9004,
    email: 'amila@kkbus.pl',
    login: 'amila',
    password: 'haslo',
    firstName: 'Agnieszka',
    lastName: 'Miła',
    birthDate: '01-01-1999',
    phoneNumber: '103406709',
    role: 'office'
});
users.set('annanowak1234', {
    id: 30199,
    email: 'jankowalski@gmail.com',
    login: 'annanowak1234',
    password: 'haslo',
    firstName: 'Anna',
    lastName: 'Nowak',
    birthDate: '01-01-1999',
    phoneNumber: '803401234',
    role: 'client'
});

const usersByEmail = new Map();
usersByEmail.set('admin@kkbus.pl', users.get('admin'));
usersByEmail.set('trajdowiec@kkbus.pl', users.get('trajdowiec'));
usersByEmail.set('amila@kkbus.pl', users.get('amila'));
usersByEmail.set('jankowalski@gmail.com', users.get('jankowalski1234'));

const bookings = new Map();
bookings.set('annanowak1234', [
    { route: { id: 1, name: 'Kraków-Katowice' }, driver: 'Tomasz Rajdowiec', date: '2020-07-04', time: '12:15' },
    { route: { id: 2, name: 'Katowice-Kraków' }, driver: 'Marek Poprawny', date: '2020-07-04', time: '18:00' }
]);


reqValidator.addSchema('/api/login', '{login: string, password: string}');
app.post('/api/login', (req, res) => {
    let { login, password } = req.body;

    if (!users.has(login) && !usersByEmail.has(login)) {
        errors.badCredentials();
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
        errors.badCredentials();
    }
    
    if (user.password !== password) {
        errors.badCredentials();
    }

    let sessionToken = jwt.sign({ login }, config.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    });
});

reqValidator.addSchema('/api/register', '{email: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}');
app.post('/api/register', (req, res) => {
    let { email, firstName, lastName, birthDate, phoneNumber } = req.body;
    
    if (/\d{1,2}-\d{1,2}-\d{4}/.test(birthDate)) {
        let dateString = birthDate.split('-').reverse().join('-');
        let date = new Date(dateString);

        if (isNaN(date) || date.getFullYear() < 1900 || new Date() - date < 0)
            errors.invalidRequest();
    }
    else errors.invalidRequest();

    //NOTE: check if phoneNumber is valid

    if (usersByEmail.has(email)) errors.emailAlreadyTaken();

    let offset = 0;
    let phoneNumberPart = parseInt(phoneNumber.slice(-4));
    let login = firstName.toLowerCase() + lastName.toLowerCase();
    
    while (users.has(login + (phoneNumberPart + offset))) {
        offset++;
    }

    login += (phoneNumberPart + offset);

    let birthDateParts = birthDate.split('-');
    let userId = users.size + birthDateParts[1].padStart(2, '0') + birthDateParts[2].slice(-2);

    let user = {
        id: userId,
        email, login,
        password: 'haslo',
        firstName, lastName,
        birthDate,
        phoneNumber,
        role: 'client'
    };
    usersByEmail.set(email, user);
    users.set(login, user);

    let sessionToken = jwt.sign({ login }, config.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        login,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    });
});

app.get('/api/user/info', (req, res) => {
    let { loggedIn, login, role, id, firstName, lastName } = req.user;

    if (loggedIn) {
        res.ok({ role, id, login, firstName, lastName });
    }
    else {
        res.ok({
            role: 'guest',
            id: -1,
            login: '',
            firstName: '',
            lastName: ''
        });
    }
});

reqValidator.setProtected('/api/logout');
app.get('/api/logout', (req, res) => {
    res.header('Cache-Control', 'no-cache');
    res.clearCookie('session');
    res.ok();
});

reqValidator.setProtected('/api/bookings');
app.get('/api/bookings', (req, res) => {
    let { loggedIn, login } = req.user;

    if (!loggedIn) errors.unauthorized();

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
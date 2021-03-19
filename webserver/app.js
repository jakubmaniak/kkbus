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
    email: 'annanowak@gmail.com',
    login: 'annanowak1234',
    password: 'haslo',
    firstName: 'Anna',
    lastName: 'Nowak',
    birthDate: '01-01-1999',
    phoneNumber: '803401234',
    role: 'client'
});

const sessionTokenCache = new Map();
app.use((req, res, next) => {
    req.user = {
        loggedIn: false,
        role: 'guest'
    };

    if (req.cookies.session) {
        let login;

        if (sessionTokenCache.has(req.cookies.session)) {
            login = sessionTokenCache.get(req.cookies.session);
        }
        else {
            let payload;
            try {
                payload = jwt.verify(req.cookies.session, config.jwtSecret, { algorithms: ['HS512'] });
            }
            catch {
                errors.badSessionToken();
            }

            if (payload && payload.login) {
                login = payload.login;
                sessionTokenCache.set(req.cookies.session, login);
            }
        }

        if (login) {
            req.user = {
                loggedIn: true,
                ...users.get(login)
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


reqValidator.addSchema('/api/login', '{login: string, password: string}');
reqValidator.addSchema('/api/register', '{email: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}');
reqValidator.addSchema('/api/vehicle/fuel-usage', '{vehicleId?: number}');
reqValidator.addSchema('/api/work-schedule', '{driverId: number, range: number, direction: number, routeId?: number}');


app.use('/api', require('./routers/user'));
app.use('/api', require('./routers/booking'));
app.use('/api', require('./routers/driver'));
app.use('/api', require('./routers/route'));
app.use('/api', require('./routers/vehicle'));
app.use('/api', require('./routers/work-schedule'));

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
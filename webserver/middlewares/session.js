const jwt = require('jsonwebtoken');

const env = require('../helpers/env');
const { badSessionToken } = require("../errors");

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

module.exports = () => (req, res, next) => {
    let sessionToken = req.cookies.session;

    req.user = {
        loggedIn: false,
        role: 'guest'
    };

    if (sessionToken) {
        let login;

        if (sessionTokenCache.has(sessionToken)) {
            login = sessionTokenCache.get(sessionToken);
        }
        else {
            let payload;
            try {
                payload = jwt.verify(sessionToken, env.jwtSecret, { algorithms: ['HS512'] });
            }
            catch (err) {
                if (err.name === 'JsonWebTokenError') {
                    throw badSessionToken;
                }
                else {
                    console.error(err);
                    throw serverError;
                }
            }

            if (payload && payload.login) {
                login = payload.login;
                sessionTokenCache.set(sessionToken, login);
            }
        }

        if (login) {
            req.user = {
                loggedIn: true,
                ...users.get(login)
            };
        }
        else throw badSessionToken;
    }

    next();
};
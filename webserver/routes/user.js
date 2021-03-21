const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const config = require('../helpers/config');
const { invalidRequest, emailAlreadyTaken, badCredentials } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const role = require('../middlewares/roles')(
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
);


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


const usersByEmail = new Map();
usersByEmail.set('admin@kkbus.pl', users.get('admin'));
usersByEmail.set('trajdowiec@kkbus.pl', users.get('trajdowiec'));
usersByEmail.set('amila@kkbus.pl', users.get('amila'));
usersByEmail.set('jankowalski@gmail.com', users.get('jankowalski1234'));


router.post('/user/login', [
    bodySchema('{login: string, password: string}')
], (req, res) => {
    let { login, password } = req.body;

    if (!users.has(login) && !usersByEmail.has(login)) {
        throw badCredentials;
    }

    let user;

    if (users.has(login)) {
        user = users.get(login);
    }
    else if (usersByEmail.has(login)) {
        user = usersByEmail.get(login);
        login = user.login;
    }
    else throw badCredentials;
    
    if (user.password !== password) {
        throw badCredentials;
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


router.post('/user/register', [
    bodySchema('{email: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}')
], (req, res) => {
    let { email, firstName, lastName, birthDate, phoneNumber } = req.body;
    
    if (/\d{1,2}-\d{1,2}-\d{4}/.test(birthDate)) {
        let dateString = birthDate.split('-').reverse().join('-');
        let date = new Date(dateString);

        if (isNaN(date) || date.getFullYear() < 1900 || new Date() - date < 0)
            throw invalidRequest;
    }
    else if (/^[ -+\/0-9]+$/.test(phoneNumber)) { }
    else throw invalidRequest;
    

    if (usersByEmail.has(email)) throw emailAlreadyTaken;

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


router.get('/user/logout', [role('client')], (req, res) => {
    res.header('Cache-Control', 'no-cache');
    res.clearCookie('session');
    res.ok();
});

router.get('/user/info', (req, res) => {
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


module.exports = router;
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const env = require('../helpers/env');
const { invalidRequest, emailAlreadyTaken, badCredentials } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const roles = new Map([
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
]);
const role = require('../middlewares/roles')(...roles);
const userController = require('../controllers/user');


router.post('/user/login', [
    bodySchema('{login: string, password: string}')
], async (req, res) => {
    //NOTE: login = login / e-mail
    let { login, password } = req.body;

    let user = await userController.findUserByCredentials(login, login, password);
    if (!user) throw badCredentials;
    
    //NOTE: true login
    login = user.login;

    let sessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roles.get(user.role)
    });
});


router.post('/user/register', [
    bodySchema('{email: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}')
], async (req, res) => {
    let { email, firstName, lastName, birthDate, phoneNumber } = req.body;
    
    if (/\d{1,2}-\d{1,2}-\d{4}/.test(birthDate)) {
        let dateString = birthDate.split('-').reverse().join('-');
        let date = new Date(dateString);

        if (isNaN(date) || date.getFullYear() < 1900 || new Date() - date < 0)
            throw invalidRequest;
    }
    else if (/^[ -+\/0-9]+$/.test(phoneNumber)) { }
    else throw invalidRequest;
    

    if (await userController.findUserByEmail(email)) throw emailAlreadyTaken;

    let offset = 0;
    let phoneNumberPart = parseInt(phoneNumber.slice(-4));
    let login = firstName.toLowerCase() + lastName.toLowerCase();
    
    while (await userController.findUserByLogin(login + (phoneNumberPart + offset))) {
        offset++;
    }

    login += (phoneNumberPart + offset);

    let user = {
        email, login,
        password: 'haslo',
        firstName, lastName,
        birthDate,
        phoneNumber,
        role: 1
    };
    await userController.addUser(user);

    let sessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        login,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roles.get(user.role)
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
            role: 0,
            id: -1,
            login: '',
            firstName: '',
            lastName: ''
        });
    }
});


module.exports = router;
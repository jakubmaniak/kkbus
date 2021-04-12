const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const env = require('../helpers/env');
const { invalidRequest, emailAlreadyTaken, badCredentials, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { roles, minimumRole } = require('../middlewares/roles');
const userController = require('../controllers/user');


router.post('/user/login', [
    bodySchema('{login: string, password: string}')
], async (req, res, next) => {
    //NOTE: login = login / e-mail
    let { login, password } = req.body;

    let user;
    try {
        user = await userController.findUserByCredentials(login, login, password);
    }
    catch (err) {
        if (err.message == 'not_found') {
            return next(badCredentials());
        }
        return next(serverError());
    }

    if (!user) return next(badCredentials());
    
    //NOTE: true login
    login = user.login;

    let sessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name
    });
});


router.post('/user/register', [
    bodySchema('{email: string, firstName: string, lastName: string, birthDate: string, phoneNumber: string}')
], async (req, res, next) => {
    let { email, firstName, lastName, birthDate, phoneNumber } = req.body;
    
    if (/\d{1,2}-\d{1,2}-\d{4}/.test(birthDate)) {
        let dateString = birthDate.split('-').reverse().join('-');
        let date = new Date(dateString);

        if (isNaN(date) || date.getFullYear() < 1900 || new Date() - date < 0)
            return next(invalidRequest());
    }
    else if (/^[ -+\/0-9]+$/.test(phoneNumber)) { }
    else return next(invalidRequest());

    try {
        if (await userController.findUserByEmail(email)) {
            return next(emailAlreadyTaken());
        }
    }
    catch (err) {
        if (err.message != 'not_found') {
            return next(serverError());
        }
    }

    let offset = 0;
    let phoneNumberPart = parseInt(phoneNumber.slice(-4));
    let login = firstName.toLowerCase() + lastName.toLowerCase();
    
    while (true) {
        try {
            await userController.findUserByLogin(login + (phoneNumberPart + offset));
            offset++;
        }
        catch (err) {
            if (err.message == 'not_found') {
                break;
            }
            else {
                return next(serverError());
            }
        }
    }

    login += (phoneNumberPart + offset);

    let user = {
        email, login,
        password: 'haslo',
        firstName, lastName,
        birthDate,
        phoneNumber,
        role: roles.client.priority
    };
    await userController.addUser(user);

    if (user.role == roles.office || user.role == roles.owner) {
        return res.ok({
            login
        });
    }

    let sessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

    res.cookie('session', sessionToken);
    res.ok({
        sessionToken,
        login,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name
    });
});


router.get('/user/logout', [minimumRole('client')], (req, res) => {
    res.header('Cache-Control', 'no-cache');
    res.clearCookie('session');
    res.ok();
});

router.get('/user/info', (req, res) => {
    let { loggedIn, login, role, id, firstName, lastName } = req.user;

    if (loggedIn) {
        res.ok({ role: role.name, id, login, firstName, lastName });
    }
    else {
        res.ok({
            role: roles.guest.name,
            id: -1,
            login: '',
            firstName: '',
            lastName: ''
        });
    }
});


module.exports = router;
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const env = require('../helpers/env');
const { invalidRequest, emailAlreadyTaken, badCredentials, serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { roles, minimumRole } = require('../middlewares/roles');
const { cache: usersCache } = require('../middlewares/session');
const { parseDate } = require('../helpers/date');

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
    let phoneNumberPart = parseInt(phoneNumber.slice(-4), 10);
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
        let sessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });
        
        res.cookie('session', sessionToken);
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

router.get('/user/profile', [minimumRole('client')], async (req, res, next) => {
    let user = req.user;
    
    delete user.points;
    user.birthDate = parseDate(user.birthDate)?.toString();

    res.ok(user);
});

router.patch('/user/profile', [
    minimumRole('client'),
    bodySchema(`{
        firstName?: string,
        lastName?: string,
        birthDate?: string,
        login?: string,
        email?: string,
        phoneNumber?: string
    }`)
], async (req, res, next) => {
    let {
        firstName, lastName,
        birthDate,
        login,
        email,
        phoneNumber
    } = req.body;

    let user = req.user;

    let updatedUser = {
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        birthDate: birthDate ?? user.birthDate,
        login: login ?? user.login,
        email: email ?? user.email,
        phoneNumber: phoneNumber ?? user.phoneNumber
    };

    try {
        await userController.updateUserPersonalData(req.user.id, updatedUser);
    
        if (login !== null && login !== user.login) {
            let newSessionToken = jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });

            let oldSessionToken = req.cookies.session;
            let cachedUser = usersCache.get(oldSessionToken);

            usersCache.set(newSessionToken, {
                ...cachedUser,
                ...updatedUser
            });
            usersCache.delete(oldSessionToken);
    
            res.cookie('session', newSessionToken);
        }
        else {
            let sessionToken = req.cookies.session;
            let cachedUser = usersCache.get(sessionToken);
            usersCache.set(sessionToken, {
                ...cachedUser,
                ...updatedUser
            });
        }
        
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

router.patch('/user/password', [
    minimumRole('client'),
    bodySchema('{currentPassword: string, newPassword: string}')
], async (req, res, next) => {
    let { login, id: userId } = req.user;
    let { currentPassword, newPassword } = req.body;

    try {
        await userController.findUserByCredentials(login, login, currentPassword);
    }
    catch (err) {
        if (err.message == 'not_found') {
            return next(badCredentials());
        }
        return next(err);
    }

    try {
        await userController.updateUserPassword(userId, newPassword);

        res.ok();
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
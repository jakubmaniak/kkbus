const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const env = require('../helpers/env');
const { invalidRequest, emailAlreadyTaken, badCredentials, serverError, invalidValue, notFound, loginAlreadyTaken } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { roles, minimumRole } = require('../middlewares/roles');
const { cache: usersCache } = require('../middlewares/session');
const { parseDate } = require('../helpers/date');

const userController = require('../controllers/user');

async function generateLogin(firstName, lastName, phoneNumber) {
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
                throw serverError();
            }
        }
    }

    return login + (phoneNumberPart + offset);
}

function generatePassword(passwordLength) {
    return new Array(passwordLength).fill().map(() => {
        let n = Math.floor(Math.random() * 62);
        
        if (n < 10) return n;
        if (n < 10 + 26) return String.fromCharCode(0x41 + n - 10);
        return String.fromCharCode(0x61 + n - (10 + 26));
    }).join('');
}

function hashPassword(password) {
    return bcrypt.hashSync(password, env.passwordSalt);
}

function comparePasswords(enteredPassword, targetHash) {
    return bcrypt.compareSync(enteredPassword, targetHash);
}

function generateActivationCode(email) {
    return jwt.sign({ email }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '7d' });
}

function generateSessionToken(login) {
    return jwt.sign({ login }, env.jwtSecret, { algorithm: 'HS512', expiresIn: '31d' });
}

router.post('/user/login', [
    bodySchema('{login: string, password: string}')
], async (req, res, next) => {
    //NOTE: login = username OR e-mail

    let { login, password } = req.body;

    let user;
    try {
        user = await userController.findUserByLoginOrEmail(login, login);
        if (!comparePasswords(password, user.password)) {
            throw notFound();
        }
    }
    catch (err) {
        if (err.message == 'not_found') {
            return next(badCredentials());
        }
        return next(serverError());
    }

    
    let sessionToken = generateSessionToken(user.login);

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
    
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    phoneNumber = phoneNumber.trim();

    birthDate = parseDate(birthDate);
    let birthDateObject = birthDate?.toObject();
    let birthDateString = birthDate?.toString();

    if (birthDateObject == null) {
        return next(invalidRequest());
    }

    if (birthDateObject.getFullYear() < 1900 || new Date() - birthDateObject < 0) {
        return next(invalidValue());
    }

    let validPhoneNumber = /^[ -+\/0-9]+$/.test(phoneNumber);
    if (!validPhoneNumber) {
        return next(invalidValue());
    }

    let validEmailAddress = /^[^\s]+@[^\s]+$/.test(email);
    if (!validEmailAddress) {
        return next(invalidValue());
    }

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

    try {
        let login = await generateLogin(firstName, lastName, phoneNumber);
        let password = generatePassword(12);
        let activationCode = generateActivationCode(email);
    
        await userController.sendActivationCode(email, activationCode)

        let user = {
            email,
            login,
            password,
            firstName,
            lastName,
            birthDate: birthDateString,
            phoneNumber,
            role: roles.client.priority
        };

        await userController.addInactiveUser(user);
    
        res.ok();
    }
    catch (err) {
        next(err);
    }
});

router.post('/user/activate', [
    bodySchema('{activationCode: string}')
], async (req, res, next) => {
    let { activationCode } = req.body;

    let payload;
    try {
        payload = jwt.verify(activationCode, env.jwtSecret, { algorithms: ['HS512'] });
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(invalidValue());
        }
        
        return next(serverError());
    }

    if (!payload || !payload.email) {
        return next(invalidRequest());
    }

    try {
        let user = await userController.findInactiveUser(payload.email);
        let plainPassword = user.password;
        user.password = hashPassword(plainPassword);

        await Promise.all([
            userController.addUser(user),
            userController.deleteInactiveUser(payload.email),
            userController.sendUserCredentials(payload.email, user.login, plainPassword)
        ]);

        res.cookie('session', generateSessionToken(user.login));
        res.ok();
    }
    catch (err) {
        next(err);
    }
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
        if (login !== req.login) {
            try {
                await userController.findUserByLogin(login);
                throw loginAlreadyTaken();
            }
            catch (err) {
                if (err.message !== 'not_found') {
                    throw err;
                }
            }
        }

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
        let user = await userController.findUserByLoginOrEmail(login, login);

        if (!comparePasswords(currentPassword, user.password)) {
            throw badCredentials();
        }
    }
    catch (err) {
        if (err.message == 'not_found') {
            return next(badCredentials());
        }
        return next(err);
    }

    try {
        await userController.updateUserPassword(userId, hashPassword(newPassword));

        res.ok();
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
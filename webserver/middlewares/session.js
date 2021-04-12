const jwt = require('jsonwebtoken');

const env = require('../helpers/env');
const { badSessionToken, serverError } = require("../errors");
const { roles, roleDictionary } = require('../middlewares/roles');

const userController = require('../controllers/user');



let cache = new Map();

cache.expireDates = new Map();
cache.refresh = (key) => {
    if (cache.expireDates.has(key)) {
        //console.log('Refreshed (' + cache.get(key).login + ') ' + key.substr(0, 16) + '...');
    }
    else {
        console.log('Added (' + cache.get(key).login + ') ' + key.substr(0, 16) + '... to session cache');
    }

    cache.expireDates.set(key, Date.now() + 60000);
};
cache._set = cache.set;
cache.set = (key, value) => {
    cache._set(key, value);
    cache.refresh(key);
};

setInterval(() => {
    let now = Date.now();
    let deletionList = [];

    cache.expireDates.forEach((expireDate, key) => {
        if (now >= expireDate) {
            console.log('Removed (' + cache.get(key).login + ') ' + key.substr(0, 16) + '... from session cache');

            cache.delete(key);
            deletionList.push(key);
        }    
    });

    if (deletionList.length > 0) {
        deletionList.forEach((key) => cache.expireDates.delete(key));
    }
}, 10000);


module.exports = () => async (req, res, next) => {
    let sessionToken = req.cookies.session;

    req.user = {
        loggedIn: false,
        role: roles.guest.name
    };

    if (sessionToken) {
        let user;

        if (cache.has(sessionToken)) {
            user = cache.get(sessionToken);
            cache.refresh(sessionToken);
        }
        else {
            let payload;
            try {
                payload = jwt.verify(sessionToken, env.jwtSecret, { algorithms: ['HS512'] });
            }
            catch (err) {
                if (err.name === 'JsonWebTokenError') {
                    return next(badSessionToken());
                }
                else {
                    console.error(err);
                    return next(serverError);
                }
            }

            if (payload && payload.login) {
                try {
                    user = await userController.findUserByLogin(payload.login);
                }
                catch (err) {
                    res.clearCookie('session');
                    return next(err);
                }

                if (!user) return next(badSessionToken());

                user.role = roleDictionary.getRole(user.role);
                delete user.password;

                cache.set(sessionToken, user);
            }
            else return next(badSessionToken());
        }

        req.user = {
            loggedIn: true,
            ...user
        };
    }

    next();
};

module.exports.cache = cache;
const jwt = require('jsonwebtoken');

const env = require('../helpers/env');
const { badSessionToken } = require("../errors");
const userController = require('../controllers/user');


const roles = new Map([
    [0, 'guest'],
    [1, 'client'],
    [2, 'driver'],
    [3, 'office'],
    [4, 'owner']
]);

let users = new Map();
const sessionTokenCache = new Map();

const sync = () => {
    return userController.findAllUsers().then((results) => {
        users = new Map(
            results.map((user) => [user.login, {
                ...user,
                role: roles.get(user.role),
                password: null
            }])
        );
    });
};

sync();

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

module.exports.sync = sync;
let db = require('../configs/db');
let { getFirst } = require('../helpers/query-utils');

module.exports.addUser = (user) => {
    return db.query('INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)', [
        user.id || null,
        user.email,
        user.login, user.password,
        user.role,
        user.firstName, user.lastName,
        user.birthDate,
        user.phoneNumber
    ]);
};

module.exports.findAllUsers = () => {
    return db.query('SELECT * FROM users');
};

module.exports.findUserByLoginOrEmail = (login, email) => {
    return db.query('SELECT * FROM users WHERE login=? OR email=? LIMIT 1', [login, email])
        .then(getFirst);
};

module.exports.findUserByLogin = (login) => {
    return db.query('SELECT * FROM users WHERE login=? LIMIT 1', [login])
        .then(getFirst);
};

module.exports.findUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email=? LIMIT 1', [email])
        .then(getFirst);
};

module.exports.findUserByCredentials = (login, email, password) => {
    return db.query('SELECT * FROM users WHERE (login=? OR email=?) AND password=? LIMIT 1', [
        login,
        email,
        password
    ])
    .then(getFirst);
};

module.exports.deleteUser = (login) => {
    return db.query('DELETE FROM users WHERE login=?', [login]);
};
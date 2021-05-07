let db = require('../configs/db');
let { getFirst, deleteProps, pullProp } = require('../helpers/query-utils');

module.exports.addUser = (user) => {
    return db.query('INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)', [
        null,
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

module.exports.findManyUsers = (by, query, role = null) => {
    let base = 'SELECT * FROM users WHERE ';
    let conditions, values;

    if (by == 'id' || by == 'phoneNumber') {
        conditions = '??=?';
        values = [by, query];
    }
    else if (by == 'email' || by == 'login') {
        conditions = '?? LIKE ?';
        values = [by, '%' + query + '%'];
    }
    else if (by == 'name') {
        conditions = `(CONCAT(firstName, ' ', lastName) LIKE ? OR CONCAT(lastName, ' ', firstName) LIKE ?)`;
        values = ['%' + query + '%', '%' + query + '%'];
    }
    else return null;


    if (role != null) {
        values.unshift(role);
        base += `role=? AND `;
    }
    
    return db.query(base + conditions, values)
        .then(deleteProps('password'));
};

module.exports.findManyUsersByRole = (...roles) => {
    let conditions = new Array(roles.length).fill('role=?').join(' OR ');

    return db.query('SELECT * FROM users WHERE ' + conditions, roles)
        .then(deleteProps('password'));
};

module.exports.findUserById = (userId) => {
    return db.query('SELECT * FROM users WHERE id=? LIMIT 1', [userId])
        .then(getFirst);
}

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

module.exports.findUserPoints = (userId) => {
    return db.query('SELECT points FROM users WHERE id=? LIMIT 1', [userId])
    .then(pullProp('points'))
    .then(getFirst);
};

module.exports.updateUserPoints = (userId, points) => {
    return db.query('UPDATE users SET points=? WHERE id=?', [points, userId]);
};

module.exports.updateUserPassword = (userId, password) => {
    return db.query('UPDATE users SET password=? WHERE id=?', [password, userId]);
};

module.exports.updateUserPersonalData = (userId, personalData) => {
    return db.query(`UPDATE users
        SET firstName=?, lastName=?, birthDate=?, login=?, email=?, phoneNumber=?
        WHERE id=?`, [
            personalData.firstName,
            personalData.lastName,
            personalData.birthDate,
            personalData.login,
            personalData.email,
            personalData.phoneNumber,
            userId
        ]
    );
};
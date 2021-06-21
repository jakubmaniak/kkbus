const bcrypt = require('bcrypt');
const env = require('./helpers/env');
const userController = require('./controllers/user');


if (process.argv.length < 3) {
    throw new Error('Not enough arguments');
}

if (process.argv[2] == '*') {
    updateAllUsers().then(() => process.exit(0));
}
else {
    updateManyUsers().then(() => process.exit(0));
}

async function updateUser(user) {
    if (!(user.password.startsWith('$2b$') && user.password.length == 60)) {
        let hash = await bcrypt.hash(user.password, env.passwordSalt);
        await userController.updateUserPassword(user.id, hash);

        console.log('Changed password of ' + user.login);
    }
}

async function updateAllUsers() {
    let users = await userController.findAllUsers();
    let promises = users.map((user) => updateUser(user));

    return Promise.all(promises);
}

async function updateManyUsers() {
    let promises = [];

    for (let i = 2; i < process.argv.length; i++) {
        let promise = userController.findUserByLogin(process.argv[i])
            .then(updateUser)
            .catch((err) => {
                if (err.message === 'not_found') {
                    console.log('User ' + process.argv[i] + ' not found');
                }
                else {
                    console.log('Unknown error');
                }
            });
        promises.push(promise);
    }

    return Promise.all(promises);
}
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('env.json'));

/** @type {import('./types/env')} */
module.exports = {
    ...env,
    server: {
        host: env.host || 'localhost',
        port: env.port || 3200
    },
    jwtSecret: env.jwtSecret || 'kkbus_jwt_secret',
    mysql: {
        ...env.mysql,
        port: env.mysql.port || 3306
    }
};
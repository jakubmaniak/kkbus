const fs = require('fs');
const env = JSON.parse(fs.readFileSync('env.json'));

/** @type {import('./types/env')} */
module.exports = {
    ...env,
    server: {
        host: env.server.host || 'localhost',
        port: env.server.port || 3200,
        externalAddress: env.server.externalAddress || 'http://localhost:3000'
    },
    jwtSecret: env.jwtSecret || 'kkbus_jwt_secret',
    mysql: {
        ...env.mysql,
        connectionLimit: env.mysql.connectionLimit || 5,
        port: env.mysql.port || 3306
    }
};
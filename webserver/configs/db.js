const mysql = require('mysql');
const env = require('../helpers/env');


const pool = mysql.createPool(env.mysql);

pool.once('connection', () => console.log('Connected to the database.'));

const query = (query, values = []) => 
    new Promise((resolve, reject) => {
        pool.query(query, values, (err, results) => {
            if (!err) resolve(results);
            else reject(err);
        });
    });

module.exports = {
    pool,
    query
};
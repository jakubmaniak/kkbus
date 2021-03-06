const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json'));

const app = express();

app.use(express.static('public'));

app.get('/api/login', (req, res) => {
    res.json({});
});


app.listen(config.server.port, config.server.host, () => {
    console.log(`Listening on ${config.server.host}:${config.server.port}...`);
});


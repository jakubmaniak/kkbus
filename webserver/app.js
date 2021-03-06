const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const env = require('./helpers/env');
const { serverError } = require('./errors');
const session = require('./middlewares/session');
require('./jobs/booking-remainder');


const app = express();
app.set('etag', false);
app.use(express.static('./public'));
app.use(express.json());
app.use(cookieParser());
app.use(session());

app.use((req, res, next) => {
    res.ok = (result = null) => res.json({ error: false, result });
    next();
});


app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/client'));
app.use('/api', require('./routes/booking'));
app.use('/api', require('./routes/route'));
app.use('/api', require('./routes/route-report'));
app.use('/api', require('./routes/booking-report'));
app.use('/api', require('./routes/vehicle'));
app.use('/api', require('./routes/work-schedule'));
app.use('/api', require('./routes/availability'));
app.use('/api', require('./routes/loyalty-program'));
app.use('/api', require('./routes/employee'));
app.use('/api', require('./routes/contact'));


app.use('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.use((err, req, res, next) => {
    let errorCode = err.message;

    if (err.name != 'HandlerError') {
        errorCode = serverError().message;
        console.error(err);
    }

    res.json({ error: true, errorCode });
});

app.listen(env.server.port, env.server.host, () => {
    console.log(`Listening on ${env.server.host}:${env.server.port}...`);
});
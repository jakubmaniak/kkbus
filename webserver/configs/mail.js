const env = require('../helpers/env');
const nodemailer = require('nodemailer');

let mail = nodemailer.createTransport({
    service: env.mail.service,
    auth: {
        user: env.mail.user,
        pass: env.mail.password
    }
});

module.exports.sendMail = (to, subject, body) => mail.sendMail({
    from: `"${env.mail.senderName}" <${env.mail.user}>`,
    to,
    subject,
    html: body
});
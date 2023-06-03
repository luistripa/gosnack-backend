
const nodemailer = require('nodemailer');
const pug = require("pug");

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: "latb-lxro-tzdk-dstv"
    }
});

async function sendTemperatureWarningEmail(user, machine, temperature) {
    return new Promise((resolve, reject) => {

        pug.renderFile("./utils/email/temperature_alert_email.pug", {machine: machine, temperature: temperature, time: new Date()}, (err, x) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Temperature Warning on machine '" + machine.name + "'",
                html: x
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error)
                    reject(error)

                resolve(info);
            })
        });
    })
}

async function sendInactiveEmail(machine) {
    return new Promise((resolve, reject) => {
        // TODO: Send an email with an inactive warning
    })
}

module.exports = {
    sendTemperatureWarningEmail: sendTemperatureWarningEmail,
    sendInactiveEmail: sendInactiveEmail,
}
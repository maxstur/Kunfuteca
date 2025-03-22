const nodemailer = require("nodemailer");
const {mailing} = require("../config/environment.config");

const transport = nodemailer.createTransport({
    service: mailing.service,
    port: mailing.port,
    auth: mailing.auth,
});

class MailingService {
    async sendRegisterdEmail(destinationMail) {
        await transport.sendMail({
            from: `elKuntuteca <${mailing.auth.user}>`,
            to: destinationMail,
            subject: "Registration to elKuntuteca",
            html: `<h1>This email confirm your registration</h1>`,
        })
    }

    async sendPurchaseEmail(destinationMail, ticketCode = "1235") {
        await transport.sendMail({
            from: `elKuntuteca <${mailing.auth.user}>`,
            to: destinationMail,
            subject: "Your purchase in elKuntuteca",
            html: `<h1>Here is your ticket code: ${ticketCode}, Thank you!</h1>`,
        })
    }
}

module.exports = MailingService
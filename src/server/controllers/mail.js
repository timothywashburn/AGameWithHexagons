const config = require('../../../config');

const mailjet = require ('node-mailjet')
    .apiConnect(config.mail.publicKey, config.mail.privateKey);

const senderEmail = config.mail.senderAddress;

module.exports = {
    mailjet,
    senderEmail
}



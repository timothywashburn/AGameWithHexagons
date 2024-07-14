import {LibraryResponse} from 'node-mailjet/declarations/types/api';

const config = require('../../../config');

const mailjet = require('node-mailjet').apiConnect(config.mail.publicKey, config.mail.privateKey);

async function sendResetEmail(username: string, email: string, link: string) {
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": config.mail.senderAddress,
                        "Name": "Hexagon Game"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": username
                        }
                    ],
                    "Subject": "Password Reset",
                    "TextPart": "Password Reset",
                    "HTMLPart": `<h3>Hello ${username},</h3><br/>Please click the button below to reset your password. If you did not request a password reset, 
                       <br/>please ignore this email. This link will expire in 15 minutes.<br/><br/>    
                       <a href="${link}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center;
                       text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Reset Password</a>`,
                    "CustomID": "PasswordReset"
                }
            ]
        })
    request
        .then((result: LibraryResponse<Body>) => {
            console.log(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        })
}

async function sendUsernameEmail(username: string, email: string) {
    const loginPageUrl = config.host + "/login";
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": config.mail.senderAddress,
                        "Name": "Hexagon Game"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": username
                        }
                    ],
                    "Subject": "Username Recovery",
                    "TextPart": "Username Recovery",
                    "HTMLPart": `<h3>Hello ${username},</h3><br/>You are receiving this email because you requested your username. If you did not request your username,
                       <br/>please ignore this email. Your username is as follows.<br/><br/>  
                       <h1>${username}</h1> <br/><br/>
                       <a href="${loginPageUrl}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center;
                       text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Go to Login Page</a>`,
                    "CustomID": "UsernameRecovery"
                }
            ]
        })
    request
        .then((result: LibraryResponse<Body>) => {
            console.log(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        })
}

async function sendVerificationEmail(username: string, email: string, link: string) {
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": config.mail.senderAddress,
                        "Name": "Hexagon Game"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": username
                        }
                    ],
                    "Subject": "Verify Your Email",
                    "TextPart": "Verify Your Email",
                    "HTMLPart": `<h3>Hello ${username},</h3><br/>Please use the following link to verify your email. If you did not make an account with us,
                       <br/>please ignore this email. This link will expire in 24 hours.<br/><br/>  
                       <h1>${username}</h1> <br/><br/>
                       <a href="${link}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center;
                       text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verify Email</a>`,
                    "CustomID": "emailVerification"
                }
            ]
        })
    request
        .then((result: LibraryResponse<Body>) => {
            console.log(result.body);
        })
        .catch((err) => {
            console.log(err.statusCode);
        })
}

module.exports = {
    sendResetEmail,
    sendUsernameEmail,
    sendVerificationEmail
}



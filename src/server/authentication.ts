import ServerClient, {UserProfile} from './objects/server-client';
import {Connection} from 'mysql';
import {JsonWebTokenError} from 'jsonwebtoken';
import {
    EmailChangeResponseData,
    NameChangeResponseData,
    PasswordChangeResponseData,
    RegistrationResponseData
} from '../shared/enums';

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");

const { RegistrationResponseData, NameChangeResponseData, EmailChangeResponseData, PasswordChangeResponseData } = require('../shared/enums');
const config = require('../../config.json');
const { sendResetEmail, sendUsernameEmail, sendVerificationEmail } = require('./controllers/mail');

const saltRounds = 10;
let connection: Connection;

function init() {
    connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    });

    connection.connect((err) => {
        if (err) {
            console.error('error connecting to MySQL:', err);
            return;
        }
        console.log('connected to MySQL database');
    });

    connection.query(`CREATE TABLE IF NOT EXISTS accounts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        last_logout BIGINT NOT NULL DEFAULT 0
        
    )`, (err) => {
        if (err) {
            console.error('error creating accounts table:', err);
        }
    });
}

async function hashPassword(password: string) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw error;
    }
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error;
    }
}

async function createAccount(username: string, password: string): Promise<RegistrationResponseData> {
    if (!await isUsernameValid(username)) return RegistrationResponseData.USERNAME_INVALID.id;

    let userExists;

    userExists = await new Promise<RegistrationResponseData | null>((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(RegistrationResponseData.USERNAME_INVALID);
            if (result.length > 0) resolve(RegistrationResponseData.USERNAME_EXISTS);
            resolve(null);
        });
    });
    if (userExists) return userExists;

    let hash;
    try {
        hash = await hashPassword(password);
    } catch (error) {
        return RegistrationResponseData.PASSWORD_INVALID;
    }

    return await new Promise((resolve, reject) => {
        connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) reject();
            console.log('Account created:', username);
            resolve(RegistrationResponseData.SUCCESS);
        });
    });
}

async function attemptLogin(username: string, password: string): Promise<boolean> {
    let exists = await accountExists(username);
    if (!username || !password || !exists) return false;

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            if (result.length === 0) resolve(false);

            resolve(verifyPassword(password, result[0].password));
        });
    });
}

async function accountExists(username: string) {
    try {
        return await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
                if (err) reject(err);
                resolve(result.length > 0);
            });
        });
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function generateToken(username: string, expires = '1w') {
    let id = await new Promise((resolve, reject) => {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result[0].id);
        });
    });

    const payload = {
        userId: id
    };

    const secret = config.secret;

    const options = {
        expiresIn: expires,
    };

    return jwt.sign(payload, secret, options);
}

async function validateUser(token: string, client: ServerClient) {
    try {
        const decoded = jwt.verify(token, config.secret);

        interface UserRecord {
            last_logout: number,
            username: string;
        }

        let loggedIn = await new Promise<UserRecord>((resolve, reject) => {
            connection.query('SELECT last_logout, username FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) reject(err);
                if(result.length === 0) reject('User not found');

                if((result[0].last_logout / 1000) > decoded.iat) reject('Token expired');
                resolve(result[0]);
            });
        });

        if(!loggedIn) return false;
        if(!client) return true;

        client.isAuthenticated = true;
        client.profile = new UserProfile(decoded.userId, loggedIn.username);

    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            console.error('Error with token');
        } else {
            console.error('Error verifying JWT');
            console.error(error);
        }
        return false;
    }
    return true;
}

async function getUserID(username: string) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result[0].id);
        });
    });

}

 async function logout(token: string) {
    const jwt = require('jsonwebtoken');

    try {
        const decoded = jwt.verify(token, config.secret);

        let loggedOut = await new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET last_logout = ? WHERE id = ?', [Date.now(), decoded.userId], (err, result) => {
                if(err) reject(err);
                // @ts-ignore
                resolve();
            });
        });

        if(!loggedOut) return true;

    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return false;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return false;
        }
    }

    return true;
}

async function getAccountInfo(token: string): Promise<object> {
    try {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((resolve, reject) => {
            connection.query('SELECT username, email, email_verified FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error getting account info:', err);
                    reject(err);
                }
                resolve(result[0]);
            });
        });
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return {};
        }
        throw error;
    }
}

async function changeUsername(token: string, newUsername: string): Promise<NameChangeResponseData> {
    if (!await isUsernameValid(newUsername)) return NameChangeResponseData.USERNAME_INVALID;
    if (await isUsernameTaken(newUsername)) return NameChangeResponseData.USERNAME_EXISTS;

    try {
        const decoded = jwt.verify(token, config.secret);

        await new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET username = ? WHERE id = ?', [newUsername, decoded.userId], (err, result) => {
                console.log("test")
                if(err) {
                    console.error('Error updating username:', err);
                    reject(err);
                }
                resolve(result);
            });
        });
        return NameChangeResponseData.SUCCESS;

    } catch (error) {
        if (error instanceof JsonWebTokenError) return NameChangeResponseData.ERROR;
        throw error;
    }
}

async function changeEmail(token: string, newEmail: string): Promise<EmailChangeResponseData> {
    if (!validator.validate(newEmail)) return EmailChangeResponseData.EMAIL_INVALID;
    if (await isEmailInUse(newEmail)) return EmailChangeResponseData.EMAIL_EXISTS;

    try {
        const decoded = jwt.verify(token, config.secret);

        await new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET email = ? WHERE id = ?', [newEmail, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating email:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        connection.query('UPDATE accounts SET last_email_change = ? WHERE id = ?', [Date.now(), decoded.userId], (err) => {
            if(err) {
                console.error('Error updating email change time:', err);
                return EmailChangeResponseData.ERROR;
            }
        });

        await sendEmailVerification(token);
        return EmailChangeResponseData.SUCCESS;

    } catch (error) {
        if (error instanceof JsonWebTokenError) return EmailChangeResponseData.ERROR;
        throw error;
    }
}

async function changePassword(token: string, oldPassword: string, newPassword: string, requireOld = true): Promise<PasswordChangeResponseData> {
    //TODO: Add password restrictions

    try {
        const decoded = jwt.verify(token, config.secret);

        if (requireOld) {
            let passwordValid = await new Promise((resolve, reject) => {
                connection.query('SELECT password FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                    if(err) reject(err);
                    resolve(verifyPassword(oldPassword, result[0].password));
                });
            });

            if (!passwordValid) return PasswordChangeResponseData.PASSWORD_INCORRECT;
        }

        let hash = await hashPassword(newPassword);
        await new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET password = ? WHERE id = ?', [hash, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating password:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        return PasswordChangeResponseData.SUCCESS;
    } catch (error) {
        if (error instanceof JsonWebTokenError) return PasswordChangeResponseData.ERROR;
        throw error;
    }
}

async function requestPasswordReset(email: string) {
    if (!await isEmailInUse(email)) return;

    try {
        let username = await getUsername(email);
        if (!username) return;

        let token = await generateToken(username, '15m');
        let link = config.host + `/reset?token=${token}`;

        await sendResetEmail(username, email, link);
    } catch (error) {
        console.error('Error while requesting password reset:');
        console.error(error);
    }
}

async function requestUsername(email: string) {
    if (!await isEmailInUse(email)) return;

    try {
        let username = await getUsername(email);
        if (!username) return;

        await sendUsernameEmail(username, email);
    } catch (error) {
        console.error('Error while requesting username:');
        console.error(error);
    }
}

async function sendEmailVerification(token: string){
    try {
        const decoded = jwt.verify(token, config.secret);

        let email: string = await new Promise((resolve, reject) => {
            connection.query('SELECT email FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) reject(err);
                resolve(result[0].email);
            });
        });

        let reset = new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET email_verified = ? WHERE id = ?', [false, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating email verification status:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        if (!email || !reset) return;

        let username = await getUsername(email);

        if (!username) return;

        let verifyToken = await generateToken(username, '24h');
        let link = config.host + `/api/verify?token=${verifyToken}`;

        await sendVerificationEmail(username, email, link);
    } catch (error) {
        console.error('Error while sending email verification:');
        console.error(error);
    }
}

async function verifyEmail(token: string): Promise<boolean> {
    try {
        const decoded = jwt.verify(token, config.secret);

        let emailChange = await new Promise<number>((resolve, reject) => {
            connection.query('SELECT last_email_change FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) reject(err);
                resolve(result[0].last_email_change);
            });
        });

        if (Math.floor(emailChange / 1000) > decoded.iat) {
            return false;
        }

        return new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET email_verified = ? WHERE id = ?', [true, decoded.userId], (err, result) => {
                if (err) {
                    console.error('Error updating email verification status:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

    } catch (error) {
        if (error instanceof JsonWebTokenError) return false;
        throw error;
    }
}

async function getUsername(email: string) {
    return await new Promise<string | null>((resolve, reject) => {
        connection.query('SELECT username FROM accounts WHERE email = ?', [email], (err, result) => {
            if (err) reject(err);
            if (result.length === 0) {
                resolve(null);
                return;
            }

            resolve(result[0].username);
        });
    });
}

async function isUsernameTaken(username: string) {
    return await new Promise<boolean>((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result.length > 0);
        });
    });

}

async function isUsernameValid(username: string) {
    if(username.match('^(?=.{3,39}$)[a-zA-Z\\d]+(?:-[a-zA-Z\\d]+)*$')) return true;
}

async function isEmailInUse(email: string) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE email = ?', [email], (err, result) => {
            if (err) reject(err);

            if (result.length === 0) {
                resolve(false);
                return;
            }

            let verified = result[0].email_verified;
            resolve(verified[0] === 1);
        });
    });
}

module.exports = {
    init,
    createAccount,
    attemptLogin,
    generateToken,
    validateUser,
    logout,
    getAccountInfo,
    changeUsername,
    changeEmail,
    changePassword,
    requestPasswordReset,
    requestUsername,
    sendEmailVerification,
    verifyEmail
};


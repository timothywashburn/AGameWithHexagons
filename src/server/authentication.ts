import {UserProfile} from './objects/client';

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");

const { RegistrationError, NameChangeError, EmailChangeError, PasswordChangeError } = require('../shared/enums');
const config = require('../../config.json');
const { sendResetEmail, sendUsernameEmail, sendVerificationEmail } = require('./controllers/mail');


const saltRounds = 10;

let connection;

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

async function verifyPassword(password: string, hashedPassword: string) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error;
    }
}

async function createAccount(username: string, password: string) {
    if (!await isUsernameValid(username)) return RegistrationError.USERNAME_INVALID.id;

    let userExists;

    try {
        userExists = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
                if (err) reject(RegistrationError.USERNAME_INVALID.id);
                if (result.length > 0) resolve(RegistrationError.USERNAME_EXISTS.id);
                resolve(null);
            });
        });
    } catch (error) {
        return error;
    }

    if (userExists) return userExists;

    let hash;
    try {
        hash = await hashPassword(password);
    } catch (error) {
        return RegistrationError.PASSWORD_INVALID.id; // Error hashing password
    }

    let accountCreated;

    try {
        accountCreated = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
                if (err) reject(); // Error creating account
                resolve(RegistrationError.SUCCESS.id);
            });
        });
    } catch (error) {
        return error;
    }

    console.log('Account created:', username);
    return accountCreated;
}

async function attemptLogin(username, password) {
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

async function accountExists(username) {
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

async function generateToken(username, expires = '1w') {
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

async function validateUser(token, client) {
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

        client.authenticated = true;
        client.profile = new UserProfile(decoded.userId, loggedIn.username);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
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
        if (error.name === 'JsonWebTokenError') {
            return false;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return false;
        }
    }

    return true;
}

async function getAccountInfo(token) {

    try {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((resolve, reject) => {
            connection.query('SELECT username, email, email_verified FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error getting account info:', err);
                    reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return false;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return false;
        }
    }
}

async function changeUsername(token, newUsername) {
    if (!await isUsernameValid(newUsername)) return NameChangeError.USERNAME_INVALID.id;

    if (await isUsernameTaken(newUsername)) return NameChangeError.USERNAME_EXISTS.id;

    try {
        const decoded = jwt.verify(token, config.secret);

        let promise = new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET username = ? WHERE id = ?', [newUsername, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating username:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        if (promise) return NameChangeError.SUCCESS.id;
        else return NameChangeError.ERROR.id;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return NameChangeError.ERROR.id;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return NameChangeError.ERROR.id;
        }
    }
}

async function changeEmail(token: string, newEmail: string) {
    if (!validator.validate(newEmail)) return EmailChangeError.EMAIL_INVALID.id;
    if (await isEmailInUse(newEmail)) return EmailChangeError.EMAIL_EXISTS.id;

    try {
        const decoded = jwt.verify(token, config.secret);

        let promise = new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET email = ? WHERE id = ?', [newEmail, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating email:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        if (promise) {
            connection.query('UPDATE accounts SET last_email_change = ? WHERE id = ?', [Date.now(), decoded.userId], (err) => {
                if(err) {
                    console.error('Error updating email change time:', err);
                    return EmailChangeError.ERROR.id;
                }
            });

            await sendEmailVerification(token);

            return EmailChangeError.SUCCESS.id;
        }

        else return EmailChangeError.ERROR.id;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return EmailChangeError.ERROR.id;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return EmailChangeError.ERROR.id;
        }
    }
}

async function changePassword(token, oldPassword, newPassword, requireOld = true) {
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

            if (!passwordValid) return PasswordChangeError.PASSWORD_INCORRECT.id;
        }

        let hash = await hashPassword(newPassword);
        let promise = new Promise((resolve, reject) => {

            connection.query('UPDATE accounts SET password = ? WHERE id = ?', [hash, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating password:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        if (promise) return PasswordChangeError.SUCCESS.id;
        else return PasswordChangeError.ERROR.id;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return PasswordChangeError.ERROR.id;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return PasswordChangeError.ERROR.id;
        }
    }
}

async function requestPasswordReset(email) {
    if (!await isEmailInUse(email)) return;

    try {
        let username = await getUsername(email);

        if (!username) return;

        let token = await generateToken(username, '15m');
        let link = config.host + `/reset?token=${token}`;

        await sendResetEmail(username, email, link);
    } catch (error) {
        console.error('Error while requesting password reset:', error);
    }
}

async function requestUsername(email) {
    if (!await isEmailInUse(email)) return;

    try {
        let username = await getUsername(email);

        if (!username) return;

        await sendUsernameEmail(username, email);
    } catch (error) {
        console.error('Error while requesting username:', error);
    }
}

async function sendEmailVerification(token){
    try {
        const decoded = jwt.verify(token, config.secret);

        let email = await new Promise((resolve, reject) => {
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
        console.error('Error while sending email verification:', error);
    }
}

async function verifyEmail(token) {
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

        let promise = new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET email_verified = ? WHERE id = ?', [true, decoded.userId], (err, result) => {
                if(err) {
                    console.error('Error updating email verification status:', err);
                    reject(err);
                }
                resolve(result);
            });
        });

        return !!promise;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return false;
        } else {
            console.error('Error verifying JWT');
            console.error(error);
            return false;
        }
    }
}

async function getUsername(email) {

    return new Promise((resolve, reject) => {
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

async function isUsernameTaken(username) {

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result.length > 0);
        });
    });

}

async function isUsernameValid(username) {
    if(username.match('^(?=.{3,39}$)[a-zA-Z\\d]+(?:-[a-zA-Z\\d]+)*$')) return true;
}

async function isEmailInUse(email) {
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


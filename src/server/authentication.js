const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");

const { RegistrationError, NameChangeError, EmailChangeError } = require('../shared/enums.js');
const config = require('../../config.json');
const { UserProfile } = require('./objects/client');


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

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw error;
    }
}

async function verifyPassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error;
    }
}

async function createAccount(username, password) {
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

async function generateToken(username) {
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
        // expiresIn: '1w',
        expiresIn: '999y',
    };

    return jwt.sign(payload, secret, options);
}

async function validateUser(token, client) {
    try {
        const decoded = jwt.verify(token, config.secret);

        let loggedIn = await new Promise((resolve, reject) => {
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
            console.error('Error with token: ' + error);
        } else {
            console.error('Error verifying JWT: ' + error);
        }
        return false;
    }
    return true;
}

async function getUserID(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result[0].id);
        });
    });

}

 async function logout(token) {
    const jwt = require('jsonwebtoken');

    try {
        const decoded = jwt.verify(token, config.secret);

        let loggedOut = await new Promise((resolve, reject) => {
            connection.query('UPDATE accounts SET last_logout = ? WHERE id = ?', [Date.now(), decoded.userId], (err, result) => {
                if(err) reject(err);
                resolve();
            });
        });

        if(!loggedOut) return true;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return false;
        } else {
            console.error('Error verifying JWT');
            return false;
        }
    }

    return true;
}

async function getAccountInfo(token) {

    try {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((resolve, reject) => {
            connection.query('SELECT username, email FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
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
            return NameChangeError.ERROR.id;
        }
    }
}

async function changeEmail(token, newEmail) {
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

        if (promise) return EmailChangeError.SUCCESS.id;
        else return EmailChangeError.ERROR.id;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return EmailChangeError.ERROR.id;
        } else {
            console.error('Error verifying JWT');
            return EmailChangeError.ERROR.id;
        }
    }
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
    //TODO: Implement this

    return true;
}

async function isEmailInUse(email) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM accounts WHERE email = ?', [email], (err, result) => {
            if (err) reject(err);
            resolve(result.length > 0);
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
    changeEmail
};


const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { RegistrationError } = require('../shared/enums.js');
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
            return;
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
    let userExists;

    try {
        userExists = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
                if (err) reject(RegistrationError.USERNAME_INVALID.code);
                if (result.length > 0) resolve(RegistrationError.USERNAME_EXISTS.code);
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
        return RegistrationError.PASSWORD_INVALID.code; // Error hashing password
    }

    let accountCreated;

    try {
        accountCreated = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
                if (err) reject(); // Error creating account
                resolve(RegistrationError.SUCCESS.code);
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
        userId: id,
        username: username,
    };

    const secret = config.secret;

    const options = {
        // expiresIn: '1w',
        expiresIn: '999y',
    };

    const token = jwt.sign(payload, secret, options);

    return token;
}

async function validate(token) {
    await validateUser(token, null);
}

async function validateUser(token, client) {
    try {
        const decoded = jwt.verify(token, config.secret);

        let loggedIn = await new Promise((resolve, reject) => {
            connection.query('SELECT last_logout FROM accounts WHERE id = ?', [decoded.userId], (err, result) => {
                if(err) reject(err);
                if(result.length === 0) reject('User not found');

                if((result[0].last_logout / 1000) > decoded.iat) reject('Token expired');
                resolve(true);
            });
        });

        if(!loggedIn) return false;
        if(!client) return true;

        client.authenticated = true;
        client.profile = new UserProfile(decoded.userId, decoded.username);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return false;
        } else {
            console.error('Error verifying JWT: ' + error);
            return false;
        }
    }
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

module.exports = {
    init,
    createAccount,
    attemptLogin,
    generateToken,
    validate,
    validateUser,
    getUserID,
    logout
};


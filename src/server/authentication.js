const { RegistrationError } = require('../shared/enums.js');
const mysql = require('mysql');

let connection = null;
let config = null;

function init(config) {
    this.config = config;

    console.log('init config: ' + this.config);

    connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');
    });

    connection.query(`CREATE TABLE IF NOT EXISTS accounts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating accounts table:', err);
            return;
        }
        console.log('Created accounts table');
    });

  exampleUsage().then(r => console.log(r));


}

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// Example usage
async function exampleUsage() {
    const password = 'user_password';

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    // Verify the password
    const isMatch = await verifyPassword(password, hashedPassword);
    console.log('Password match:', isMatch);
}

async function createAccount(username, password) {
    let userExists;

    try {
        userExists = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, result) => {
                if (err) reject(RegistrationError.USERNAME_INVALID.code); // Error checking username
                if (result.length > 0) resolve(RegistrationError.USERNAME_EXISTS.code); // Username already exists
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
    const jwt = require('jsonwebtoken');

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

    console.log('CONFIG: ' + this.config)
    const secret = this.config.secret;

    const options = {
        expiresIn: '1h',
    };

    const token = jwt.sign(payload, secret, options);

    console.log(token);
    return token;
}

function validateUser(token, client) {
    const jwt = require('jsonwebtoken');
    const { UserProfile } = require('./client');

    try {
        const decoded = jwt.verify(token, this.config.secret); // Replace 'config.secret' with your actual secret

        client.authenticated = true;
        client.profile = new UserProfile(decoded.id, decoded.username);

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

async function getUserID(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], (err, result) => {
            if (err) reject(err);
            resolve(result[0].id);
        });
    });

}





module.exports = {
    init,
    createAccount,
    attemptLogin,
    generateToken,
    validateUser,
    getUserID
};


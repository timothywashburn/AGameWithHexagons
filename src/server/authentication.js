const { RegistrationError } = require('../shared/enums.js');
const mysql = require('mysql');

let connection = null;

function init(config) {
    console.log(config);

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



module.exports = {
    init,
    createAccount,
};


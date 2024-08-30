import mysql, {Connection} from "mysql";
import config from "../../../config.json";

let connection: Connection;

export function init() {
    connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
    });

    connection.connect((err) => {
        if (err) {
            console.error('error connecting to MySQL:', err);
            return;
        }
        console.log('connected to MySQL database');
    });

    connection.query(
        `CREATE TABLE IF NOT EXISTS accounts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        last_logout BIGINT NOT NULL DEFAULT 0
    )`,
        (err) => {
            if (err) {
                console.error('error creating accounts table:', err);
            }
        },
    );
}

export function runQuery<T>(query: string, params: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}
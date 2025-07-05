const mysql = require('mysql2');
require ('dotenv').config();
const util = require('util');

// creating connection pool

const pool= mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        console.error('Database error:', err.message);
    } else {
        console.log('MySQL connection pool established.');
    }

    if (connection) connection.release();
});

// Promisify query to use async/await
pool.query = util.promisify(pool.query);

module.exports = pool;


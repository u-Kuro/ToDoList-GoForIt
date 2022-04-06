// Database
const mysql = require('mysql');
const dotenv = require('dotenv');
// Encrypt Database Data from Source
require('dotenv').config();
dotenv.config({
    path: './.env'
});
// export
module.exports = {
    db: mysql.createPool({
        host: process.env.database_host || 'localhost',
        user: process.env.database_user || 'root',
        password: process.env.database_password || '',
        database: process.env.database || 'gfi_v1'
    }),
}

const mysql = require('mysql');
const dotenv = require('dotenv');
// Local Database
// // Encrypt Database Data from Source
// require('dotenv').config();
// dotenv.config({
//     path: './.env'
// });
// // export
// module.exports = {
//     db: mysql.createConnection({
//         host: process.env.database_host,
//         user: process.env.database_user,
//         password: process.env.database_password,
//         database: process.env.database
//     }),
// }

MYSQL_ADDON_DB="befeuvpfiaa3rtu9epbq"
MYSQL_ADDON_HOST="befeuvpfiaa3rtu9epbq-mysql.services.clever-cloud.com"
MYSQL_ADDON_PASSWORD="7woIJDSrlJOYNUlHsjUo"
MYSQL_ADDON_PORT="3306"
MYSQL_ADDON_URI="mysql://ujsbx7iwkutsnhcu:7woIJDSrlJOYNUlHsjUo@befeuvpfiaa3rtu9epbq-mysql.services.clever-cloud.com:3306/befeuvpfiaa3rtu9epbq"
MYSQL_ADDON_USER="ujsbx7iwkutsnhcu"
MYSQL_ADDON_VERSION="8.0"


module.exports = { 
    db: mysql.createConnection({
    	host     : process.env.MYSQL_ADDON_HOST,
    	database : process.env.MYSQL_ADDON_DB,
    	user     : process.env.MYSQL_ADDON_USER,
    	password : process.env.MYSQL_ADDON_PASSWORD
  })
}
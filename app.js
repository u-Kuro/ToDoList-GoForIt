const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var db = require('./db').db;
require('dotenv').config();

const app = express();

/// Create Server
app.listen(5500, () => {
    console.log('Server started on port 5500');
});

const publicDirectory = path.join(__dirname, 'public');

/// Auto Reload Template (HTML/HBS) Changes
const livereloadServer = livereload.createServer();
livereloadServer.watch(publicDirectory);
livereloadServer.server.once("connection", () => {
  setTimeout(() => {
    livereloadServer.refresh("/");
  }, 100);
});
app.use(connectLivereload());

// view engine setup uses hbs instead of html file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(publicDirectory));
app.use(express.static('public/icons'));
app.use(express.static('public/scripts'));

// Create Session (Always on Top of Routes)
var sessionStore = new MySQLStore({
    host: process.env.database_host || '127.0.0.1',
    port: process.env.database_port || '3306',
    user: process.env.database_user || 'root',
    database: process.env.database || 'gfi_v1',
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 10,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
    }
},db);

app.use(session({
    name: process.env.sess_name || 'asdadsads',
	secret: process.env.sess_secret || 'asdsad',
	resave: false,
	saveUninitialized: false,
    store: sessionStore
}));

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/category', require('./routes/category'));
app.use('/task', require('./routes/task'));

db.connect((error) => {
    if(error){
        console.log(error)
    } else {
        console.log('MYSQL Connected...')
    }
});

module.exports = app;
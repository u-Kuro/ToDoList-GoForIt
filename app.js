const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
var db = require('./db').db;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const app = express();

// Create Server
let PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server started on port '+PORT);
});

const publicDirectory = path.join(__dirname, 'public');

// Auto Reload Template (HTML/HBS) Changes
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
    host: process.env.database_host,
    port: process.env.database_port,
    user: process.env.database_user,
    database: process.env.database,
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
    name: process.env.sess_name,
	secret: process.env.sess_secret,
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


// Ping Deployed App
const request = require('request');
const ping = () => request('https://todolist-goforit.herokuapp.com/', (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print body of response received
});
var offset = ((new Date().getTimezoneOffset())*-1)/60// Server Offset
var shouroffset = Math.floor(offset);
var sminoffset = 60*(offset - shouroffset);
var serverDate = new Date();
serverDate.setHours(serverDate.getHours()-shouroffset+8);// Server to GMT+8 time
serverDate.setMinutes(serverDate.getMinutes()-sminoffset);
var localhour = serverDate.getHours();
if (localhour >= 7 && localhour <= 21) {// 7am to 9pm
    intervalisSet = true;
    setInterval(ping, 5*60*1000); // Ping Interval 5 min
}

module.exports = app;
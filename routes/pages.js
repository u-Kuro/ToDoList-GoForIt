const express = require('express');
const db = require('../db').db;
const timeConverter = require('../public/scripts/additional').timeConverter;
const timeConverterSQLtoHTML = require('../public/scripts/additional').timeConverterSQLtoHTML;
const checktasktimeStatus = require('../public/scripts/additional').checktasktimeStatus;
const router = express.Router();
var havemessage = require('../controllers/auth').havemessage;
var message = require('../controllers/auth').message;

router.get('/', (req, res) => {
    if(req.session.isAuth){
        return res.redirect('/home');
    }
    return res.render('login');
});

router.get('/register', (req, res) => {
    if(req.session.isAuth){
        return res.redirect('/home');
    } if(havemessage){
        return res.render('register',{
            message: message
        });
    }
    return res.render('register');
});

router.get('/login', (req, res) => {
    if(req.session.isAuth){
        return res.redirect('/home');
    } else {
        if(req.session.isNotLogged) {
            req.session.isNotLogged = false;
            return res.render('login', {
                messagecolor: 'red',
                message: 'Unauthorized, Login First'
            });
        }
        return res.render('login');
    }
});

router.get('/home', (req, res) => {
    if(req.session.isAuth){
        db.query('SELECT * FROM category WHERE users_id = ?', [req.session.users_id], (error, catres) => {  
                if(error){
                    console.log(error);
                    return res.render('login', {
                        messagecolor: 'red',
                        message: 'Something went wrong, Please Try Again Later'
                    });
                }
                if(catres.length>0){
                    if(req.session.categoryischosen){
                        // Select User's Database
                        var sql = "SELECT * FROM tasks WHERE date_status = ? AND users_id = '"+req.session.users_id+"' ORDER BY end_date";
                        db.query(sql, 'Missed', (error, mistasres) => {  if(error){console.log(error); return res.render('login', {messagecolor: 'red', message: 'Something went wrong, Please Try Again Later'});}
                            var sql = "SELECT * FROM tasks WHERE date_status = ? AND users_id = '"+req.session.users_id+"' ORDER BY end_date";
                            db.query(sql, 'Today', (error, todtasres) => {  if(error){console.log(error); return res.render('login', {messagecolor: 'red', message: 'Something went wrong, Please Try Again Later'});}
                                var sql = "SELECT * FROM tasks WHERE date_status = ? AND users_id = '"+req.session.users_id+"' ORDER BY end_date";
                                db.query(sql, 'Soon', (error, sootasres) => {  if(error){console.log(error); return res.render('login', {messagecolor: 'red', message: 'Something went wrong, Please Try Again Later'});}
                                    var sql = "SELECT * FROM tasks WHERE category_id = ? AND users_id = '"+req.session.users_id+"' ORDER BY end_date";
                                    db.query(sql, req.session.category_id, (error, tasres) => {  if(error){console.log(error); return res.render('login', {messagecolor: 'red', message: 'Something went wrong, Please Try Again Later'});}
                                        db.query('SELECT * FROM tasks WHERE users_id = ? ORDER BY end_date', req.session.users_id, (error, newtasres) => {  if(error){console.log(error); return res.render('login', {messagecolor: 'red', message: 'Something went wrong, Please Try Again Later'});}
                                            // Reload Task Status
                                            var date_status;
                                            if(newtasres.length>0){    
                                                for(let i=0;i<newtasres.length;i++){
                                                    date_status = checktasktimeStatus(newtasres[i].start_date,newtasres[i].end_date)
                                                    var sql = "UPDATE tasks SET ? WHERE users_id = '"+req.session.users_id +"' AND id = '"+newtasres[i].id+"'";
                                                    db.query(sql, {date_status: date_status}, (error, results) => {
                                                        if(error){
                                                            console.log(error);
                                                            return res.render('login', {
                                                                messagecolor: 'red',
                                                                message: 'Something went wrong, Please Try Again Later'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                            if(tasres.length>0){
                                                for(let i=0; i<tasres.length; i++){
                                                    tasres[i].start_date = timeConverter(tasres[i].start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                    tasres[i].end_date = timeConverter(tasres[i].end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                }
                                            }
                                            if(newtasres.length>0){
                                                for(let i=0;i<newtasres.length; i++){
                                                    newtasres[i].start_date = timeConverterSQLtoHTML(newtasres[i].start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                    newtasres[i].end_date = timeConverterSQLtoHTML(newtasres[i].end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                }
                                            }
                                            if(mistasres.length>0){
                                                for(let i=0; i<mistasres.length; i++){
                                                    mistasres[i].start_date = timeConverter(mistasres[i].start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                    mistasres[i].end_date = timeConverter(mistasres[i].end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                }
                                            }
                                            if(todtasres.length>0){
                                                for(let i=0; i<todtasres.length; i++){
                                                    todtasres[i].start_date = timeConverter(todtasres[i].start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                    todtasres[i].end_date = timeConverter(todtasres[i].end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                }
                                            }
                                            if(sootasres.length>0){
                                                for(let i=0; i<sootasres.length; i++){
                                                    sootasres[i].start_date = timeConverter(sootasres[i].start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                    sootasres[i].end_date = timeConverter(sootasres[i].end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);
                                                }
                                            }
                                            return res.render('home', {
                                                category: catres,
                                                tasks: tasres,
                                                newtasks: newtasres,
                                                missedtasks: mistasres,
                                                todaytasks: todtasres,
                                                soontasks: sootasres,
                                                username: req.session.username
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        const resetcategorychosen = "UPDATE category SET ? WHERE id = '"+ catres[0].id +"' AND users_id = '"+ req.session.users_id +"'";
                        db.query(resetcategorychosen,{user_chosen: 1}, (error, results) => {
                            if(error){
                                console.log(error);
                                return res.render('login', {
                                    messagecolor: 'red',
                                    message: 'Something went wrong, Please Try Again Later'
                                });
                            }
                        });
                        req.session.category_id = catres[0].id
                        req.session.categoryischosen = true;
                        return res.redirect('/home')
                    }
                } else {
                    return res.render('home',{
                        username: req.session.username
                    });
                }
            });
    } else {
        req.session.isNotLogged = true;
        return res.redirect('login');
    }
});


module.exports = router;
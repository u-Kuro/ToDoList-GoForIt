
const bcryptjs = require('bcryptjs');
var db = require('../db').db;

exports.register = (req, res) => {
    
    const {username, email, password, cpassword} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, emres) => {
        if(error){
            console.log(error);
        } 
        if(emres.length>0){
            return res.render('register', {
                message: 'Email is already in use'
            });
        } else {
            db.query('SELECT username FROM users WHERE username = ?', [username], async (error, useres) => {
                if(error){
                    console.log(error);
                } 
                if(useres.length>0) {
                    return res.render('register', {
                        message: 'Username is already in use'
                    });
                } else {
                    if(password !== cpassword){
                        return res.render('register', {
                            message: 'Passwords do not Match'
                        });
                    } else {
                        var hashedPassword = await bcryptjs.hash(password, 8);
                        db.query('INSERT INTO users SET ? ', {username: username, email: email, password: hashedPassword}, (error, results) => {
                            if(error){
                                console.log(error);
                            } else {
                                return res.render('login',{
                                    message: 'Account is Registered, you may Sign-in',
                                    messagecolor: 'green'
                                });
                            }
                        });
                    }
                } 

            });
        } 
    });
}

exports.login = (req, res) => {
    const {useremail, password, ctohour, ctomin} = req.body;
    db.query('SELECT password, id, username FROM users WHERE email = ?', [useremail], async (error, emres) => {
        if(error){
            console.log(error);
        }
        if(emres.length>0){
            const accountisValid = await bcryptjs.compare(password, emres[0].password);
            if(accountisValid){   
                req.session.isAuth = true; // Allows User Session
                req.session.username = emres[0].username;
                req.session.users_id = emres[0].id;
                req.session.ctz_offsethour = parseFloat(ctohour); // Gets Clients Timezone Offset
                req.session.ctz_offsetmin = parseFloat(ctomin);
                req.session.categoryischosen = false;
                return res.redirect('/home');
            } else {
                return res.render('login', {
                    messagecolor: 'red',
                    message: 'Password is Incorrect'
                });
            }
        } else {
            db.query('SELECT password, id, username FROM users WHERE username = ?', [useremail], async (error, useres) => {
                if(error){
                    console.log(error);
                }
                if(useres.length>0){
                    const accountisValid = await bcryptjs.compare(password, useres[0].password);
                    if(accountisValid){     
                        req.session.isAuth = true; // Allows User Session
                        req.session.username = useres[0].username;
                        req.session.users_id = useres[0].id;
                        req.session.ctz_offsethour = parseFloat(ctohour); // Gets Clients Timezone Offset
                        req.session.ctz_offsetmin = parseFloat(ctomin);
                        req.session.categoryischosen = false;
                        return res.redirect('/home');
                    } else {
                        return res.render('login', {
                            messagecolor: 'red',
                            message: 'Password is Incorrect'
                        });
                    }
                } else {
                    return res.render('login', {
                        messagecolor: 'red',
                        message: 'Account is Not Registered'
                    });
                }
            });            
        }
    });
}

exports.logout = (req, res) => {
    const {tzisChanged} = req.body;
    const lastcategorychosen = "UPDATE category SET ? WHERE id = '"+ req.session.category_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(lastcategorychosen,{user_chosen: 0});
    req.session.destroy();
    req.sessionStore.close();
    res.clearCookie(process.env.sess_key);
    if(tzisChanged=="false") return res.redirect('/login');
    return res.render('login', { 
        messagecolor: 'red', 
        message: 'Detected Changes in Timezone, Please Sign-in Again' 
    });
}


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
    const {useremail, password} = req.body;
    db.query('SELECT password, id FROM users WHERE email = ?', [useremail], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length>0){
            const accountisValid = await bcryptjs.compare(password, results[0].password);
            if(accountisValid){
                req.session.isAuth = true; // Allows User Session
                req.session.users_id = results[0].id;
                res.redirect('/home');
            } else {
                return res.render('login', {
                    messagecolor: 'red',
                    message: 'Password is Incorrect'
                });
            }
        } else {
            db.query('SELECT password, id, username FROM users WHERE username = ?', [useremail], async (error, results) => {
                if(error){
                    console.log(error);
                }
                if(results.length>0){
                    const accountisValid = await bcryptjs.compare(password, results[0].password);
                    if(accountisValid){
                        req.session.isAuth = true; // Allows User Session
                        req.session.username = results[0].username;
                        req.session.users_id = results[0].id;
                        res.redirect('/home');
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
    const lastcategorychosen = "UPDATE category SET ? WHERE id = '"+ req.session.category_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(lastcategorychosen,{user_chosen: 0});
    req.session.destroy();
    req.sessionStore.close();
    res.clearCookie(process.env.sess_key);     
    res.redirect('/login');
}

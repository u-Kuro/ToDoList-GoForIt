var db = require('../db').db;

exports.addcategory = (req, res) => {
    const { category_name } = req.body;
    db.query('INSERT INTO category SET ? ', {users_id: req.session.users_id, category_name: category_name, user_chosen: 0} , (error, results) => {
        if(error){
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
 
}

exports.updatecategory = (req, res) => {
    const { category_name, category_id } = req.body;
    const sql = "UPDATE category SET ? WHERE id = '"+ category_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(sql,{category_name: category_name}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
}

exports.deletecategory = (req, res) => {
    const { category_id } = req.body;
    if(req.session.category_id == category_id){
        req.session.categoryischosen = false;
    }
    db.query("DELETE FROM category WHERE ?", {id: category_id}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            db.query("DELETE FROM tasks WHERE ?", {category_id: category_id}, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    res.redirect('/home');
                }
            });
        }
    });
}

exports.opencategory = (req, res) => {
    // Update Last Chosen Category
    const lastcategorychosen = "UPDATE category SET ? WHERE id = '"+ req.session.category_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(lastcategorychosen,{user_chosen: 0});
    const { category_id } = req.body;
    // Update New Chosen Category
    const newcategorychosen = "UPDATE category SET ? WHERE id = '"+ category_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(newcategorychosen,{user_chosen: 1});
    // Save in Cookies
    req.session.category_id = category_id;
    req.session.categoryischosen = true;
    res.redirect('/home');
}
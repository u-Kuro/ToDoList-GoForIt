const db = require('../db').db;
const timeConverterHTMLtoSQL = require('../public/scripts/additional').timeConverterHTMLtoSQL;
const checktasktimeStatus = require('../public/scripts/additional').checktasktimeStatus;

exports.addtask = (req, res) => {
    db.query('SELECT * FROM category WHERE users_id = ?', [req.session.users_id], async (error, catres) => {  
        if(error){
            console.log(error);
        }
        if(catres.length>0){
            const { task_name, start_date, end_date, description } = req.body;
            const newstartdate = timeConverterHTMLtoSQL(start_date);
            const newenddate = timeConverterHTMLtoSQL(end_date);
            const date_status = checktasktimeStatus(newstartdate,newenddate);
            db.query('INSERT INTO tasks SET ? ', {
                category_id: req.session.category_id,
                users_id: req.session.users_id, 
                task_name: task_name,
                start_date: newstartdate,
                end_date: newenddate,
                description: description,
                date_status: date_status}, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    res.redirect('/home');
                }
            });
        } else {
            res.render('home', {
                emptycategory: "Can't add Task There are no Categories"
            })
        }
    });
}

exports.updatetask = (req, res) => {
    const { task_id, task_name, start_date, end_date, description } = req.body;
    const newstartdate = timeConverterHTMLtoSQL(start_date);
    const newenddate = timeConverterHTMLtoSQL(end_date);
    const date_status = checktasktimeStatus(newstartdate,newenddate);
    const sql = "UPDATE tasks SET ? WHERE id = '"+ task_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(sql, {
        category_id: req.session.category_id,
        users_id: req.session.users_id, 
        task_name: task_name,
        start_date: newstartdate,
        end_date: newenddate,
        description: description,
        date_status: date_status}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
}

exports.deletetask = (req, res) => {
    const { task_id } = req.body;
    db.query("DELETE FROM tasks WHERE ?", {id: task_id}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
}

exports.changetaskstatus = (req, res) => {
    const { task_id, task_status } = req.body;
    const sql = "UPDATE tasks SET ? WHERE id = '"+ task_id +"' AND users_id = '"+ req.session.users_id +"'";
    db.query(sql, {task_status: task_status }, (error, results) => {
        if(error){
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
}

exports.refreshtasks = (req, res) => {
    const sql = "UPDATE tasks SET ? WHERE users_id = '"+req.session.users_id +"'";
    db.query('SELECT * FROM tasks WHERE users_id = ?', [req.session.users_id], async (error, tasksres) => {  
        if(tasksres.length>0){    
            for(let i=0;i<tasksres.length;i++){
                var currentdate = new Date();
                var date_status = tasksres[i].date_status;
                currentdate.setHours(currentdate.getHours());
                if(tasksres[i].end_date<currentdate)
                    date_status = 'Missed';
                else if(tasksres[i].start_date>currentdate)
                    date_status = 'Soon';
                else if(tasksres[i].start_date<=currentdate && currentdate<=tasksres[i].end_date)
                    date_status = 'Today';
                db.query(sql, {date_status: date_status}, (error, results) => {
                    if(error){
                        console.log(error);
                    } else {
                        res.redirect('/home');
                    }
                });
            }
        }
    });
}
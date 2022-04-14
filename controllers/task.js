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
            const newstartdate = timeConverterHTMLtoSQL(start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);// Client's Local Time
            const newenddate = timeConverterHTMLtoSQL(end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin);// Client's Local Time
            const date_status = checktasktimeStatus(newstartdate,newenddate);
            db.query('INSERT INTO tasks SET ? ', {
                category_id: req.session.category_id,
                users_id: req.session.users_id, 
                task_name: task_name,
                start_date: newstartdate,
                end_date: newenddate,
                description: description,
                date_status: date_status,
                task_status: 0}, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    return res.redirect('/home');
                }
            });
        } else {
            return res.render('home', {
                emptycategory: "Can't add Task There are no Categories"
            })
        }
    });
}

exports.updatetask = (req, res) => {
    const { task_id, task_name, start_date, end_date, description } = req.body;
    const newstartdate = new Date(timeConverterHTMLtoSQL(start_date, req.session.ctz_offsethour, req.session.ctz_offsetmin));
    const newenddate = new Date(timeConverterHTMLtoSQL(end_date, req.session.ctz_offsethour, req.session.ctz_offsetmin));
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
            return res.redirect('/home');
        }
    });
}

exports.deletetask = (req, res) => {
    const { task_id } = req.body;
    db.query("DELETE FROM tasks WHERE ?", {id: task_id}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            return res.redirect('/home');
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
            return res.redirect('/home');
        }
    });
}

exports.deleteallfinishedtask = (req, res) => {
    const sql = "DELETE FROM tasks WHERE task_status = ? AND users_id = '"+ req.session.users_id +"'";
    db.query(sql, 1, (error, results) => {
        if(error){
            console.log(error);
        } else {
            return res.redirect('/home');
        }
    });
}

exports.refreshtasks = (req, res) => {
    var date_status;
    db.query('SELECT * FROM tasks WHERE users_id = ?', [req.session.users_id], async (error, tasksres) => {  
        if(tasksres.length>0){    
            for(let i=0;i<tasksres.length;i++){
                date_status = checktasktimeStatus(tasksres[i].start_date,tasksres[i].end_date)
                var sql = "UPDATE tasks SET ? WHERE users_id = '"+req.session.users_id +"' AND id = '"+tasksres[i].id+"'";
                db.query(sql, {date_status: date_status}, (error, results) => {
                    if(error){
                        console.log(error);
                    }
                });
            } return res.redirect('/home');
        } else {
            return res.redirect('/home');
        }
    });
}

exports.timezoneischanged = (req, res) => {
    const {ctohour, ctomin} = req.body;
    req.session.ctz_offsethour = parseFloat(ctohour); // Gets Clients Timezone Offset
    req.session.ctz_offsetmin = parseFloat(ctomin);
    return res.redirect('/home');
}

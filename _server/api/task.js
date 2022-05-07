const express = require("express")
const app = require("../../app.js")
const handle = app.getRequestHandler()
const router = express.Router()
const db = require("../db").db

const {
  UTCSQLtoLocal,
  UTCSQLtoLocalHTML,
  LocalHTMLtoServerUTCSQL,
  CheckTimeStatus,
  TimezoneOffset,
} = require("../../helpers/time")

router.post("/addtask", (req, res) => {
  if (req.session.isAuth) {
    var noCategory = false
    const { task_name, start_date, end_date, current_date, description, category_id, ctz_offsethour, ctz_offsetmin} = req.body
    const newstartdate = LocalHTMLtoServerUTCSQL(start_date, ctz_offsethour, ctz_offsetmin ) // Client's Local Time to SQL UTC
    const newenddate = LocalHTMLtoServerUTCSQL(end_date, ctz_offsethour, ctz_offsetmin )
    const newcurrentdate = new Date((new Date(current_date)).toISOString())
    const date_status = CheckTimeStatus(newcurrentdate, newstartdate, newenddate)
    db.query("SELECT * FROM category WHERE users_id = ? LIMIT 1",[req.session.users_id],
    (error, catres)=>{
      if(error)console.log(error)
      new Promise((resolve)=>{
        if ((catres.length===0)){
          noCategory = true
          db.query("INSERT INTO category SET ? ", {
            users_id: req.session.users_id,
            category_name: "No Name",
            recent_update: new Date()},
            (error)=>{
              if (error)console.log(error)
            }
          )
        } else{
          db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"'",{
            recent_update: new Date()},
            (error)=>{
              if (error)console.log(error)
            }
          )
        }
        return resolve() 
      })
      .then(()=>{
        db.query("SELECT id FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC LIMIT 1",
        (error, newcatres) => {
          if (error) console.log(error)
          db.query("INSERT INTO tasks SET ? ", {
            users_id: req.session.users_id,
            category_id: noCategory?newcatres[0].id:category_id,
            task_name: task_name,
            start_date: newstartdate,
            end_date: newenddate,
            description: description,
            date_status: date_status,
            taskisfinished: 0,
            recent_update: new Date()},
            (error)=>{
              if(error)console.log(error)    
              db.query("SELECT * FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC", 
              (error, catres)=>{
                if(error)console.log(error)
                db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
                (error, tasres)=>{
                  if(error)console.log(error)
                  return res.json({
                    noCategory: noCategory,
                    categories: catres,
                    tasks: tasres
                  })
                })
              })
            }
          )
        })
      })
    })
  } 
  else return handle(req, res)
})

router.post("/updatetask", (req, res) => {
  if (req.session.isAuth) {
    const { task_id, category_id, task_name, start_date, end_date, current_date, description, ctz_offsethour, ctz_offsetmin} = req.body
    const newstartdate = LocalHTMLtoServerUTCSQL(start_date, ctz_offsethour, ctz_offsetmin ) // Client's Local Time to SQL UTC
    const newenddate = LocalHTMLtoServerUTCSQL(end_date, ctz_offsethour, ctz_offsetmin )
    const newcurrentdate = new Date((new Date(current_date)).toISOString())
    const date_status = CheckTimeStatus(newcurrentdate, newstartdate, newenddate)
    const current_server_date = new Date()
    new Promise((resolve) => {
      db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"'",{
      recent_update: current_server_date },
      (error)=>{
        if(error) console.log(error)
        db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '" +req.session.users_id+"'",{
          users_id: req.session.users_id,
          category_id: category_id,
          task_name: task_name,
          start_date: newstartdate,
          end_date: newenddate,
          description: description,
          date_status: date_status,
          recent_update: new Date()},
          (error)=>{
            if(error)console.log(error) 
            resolve()
          }
        )
      })
    })
    .then(()=>{
      db.query("SELECT * FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
        (error, tasres)=>{
          if(error)console.log(error)
          db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC LIMIT 1", 
          (error, newtask) => {
            if (error) {console.log(error)}
            return res.json({
              newtask: newtask[0],
              tasks: tasres,
              categories: catres,
            })
          })
        })
      })
    })
  } 
  else return handle(req, res)
})

router.post("/deletetask", (req, res) => {
  if (req.session.isAuth) {
    const { task_id, category_id } = req.body
    new Promise((resolve) => {
      const current_server_date = new Date()
      db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"'",{
      recent_update: current_server_date },
      (error)=>{
        if(error) console.log(error)
        db.query("DELETE FROM tasks WHERE ? AND users_id = '"+req.session.users_id+"'",
          { id: task_id },
          (error)=>{if(error) console.log(error)
            resolve()
          })
        }
      )
    })
    .then(()=>{   
      db.query("SELECT * FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
        (error, tasres)=>{
          if(error)console.log(error)
          return res.json({
            categories: catres,
            tasks: tasres
          })
        })
      })
    })
  } 
  else return handle(req, res)
})

router.post("/deleteallfinishedtask", (req, res) => {
  if (req.session.isAuth) {
    new Promise((resolve)=>{
      db.query("DELETE FROM tasks WHERE taskisfinished = ? AND users_id = '"+req.session.users_id+"'", 1,
      (error)=>{
        if(error)console.log(error)
        resolve()
      })
    })
    .then(()=>[
      db.query("SELECT * FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
        (error, tasres)=>{
          if(error)console.log(error)
          return res.json({
            categories: catres,
            tasks: tasres
          })
        })
      })
    ])
  }
  else return handle(req, res)
})

router.post("/changetaskcompletionstatus", (req, res) => {
  if (req.session.isAuth) {
    const { task_id } = req.body
    new Promise((resolve)=>{
      db.query("SELECT category_id, taskisfinished FROM tasks WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"'",
      (error, results)=>{
        if(error)console.log(error)
        resolve(results)
      })
    })
    .then((task)=>{
      new Promise((resolve)=>{
        const current_server_date = new Date()
        db.query("UPDATE category SET ? WHERE id = '"+task[0].category_id+"' AND users_id = '"+req.session.users_id+"'",
        {recent_update: current_server_date},
        (error)=>{
          if(error)console.log(error)
          const taskisfinished = !task[0].taskisfinished
          db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"'",
          { taskisfinished: taskisfinished }, 
          (error) => {
            if(error)console.log(error)
            resolve(task)
          })
        })
      })
      .then(()=>{
        db.query("SELECT * FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC", 
        (error, catres)=>{
          if(error)console.log(error)
          db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
          (error, tasres)=>{
            if(error)console.log(error)
            return res.json({
              categories: catres,
              tasks: tasres
            })
          })
        })
      })
    })  
  } 
  else return handle(req, res)
})

router.post("/changetaskdatestatus", (req, res) => {
  if (req.session.isAuth) {
    const { task_id, date_status } = req.body
    new Promise((resolve)=>{
      console.log(date_status)
      console.log(task_id)
      db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"'",
      { date_status: date_status }, 
      (error) => {
        if(error)console.log(error)
        console.log("inserted")
        resolve()
      })
    })
    .then(()=>{
      db.query("SELECT * FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC",
      (error, tasres)=>{
        if(error)console.log(error)
        console.log("selected")
        return res.json({
          tasks: tasres
        })
      })
    })
  } 
  else return handle(req, res)
})

module.exports = router

const express = require("express")
const app = require("../../app.js")
const handle = app.getRequestHandler()
const router = express.Router()
const db = require("../db").db

router.post("/addtask", (req, res) => {
  if (req.session.isAuth) {
    var noCategory = false
    const { task_name, start_date, end_date, description, date_status, category_id} = req.body
    db.query("SELECT 1 FROM category WHERE users_id = ? LIMIT 1",[req.session.users_id],
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
              return resolve()
            }
          )
        } else{
          db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",{
            recent_update: new Date()},
            (error)=>{
              if (error)console.log(error)
              return resolve()
            }
          )
        } 
      })
      .then(()=>{
        new Promise((resolve)=>{
          db.query("SELECT id FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC LIMIT 1",
          (error, newcatres) => {
            if (error) console.log(error)
            if(noCategory) return resolve(newcatres[0].id)
            else return resolve(category_id)
          })
        }).then((categoryid)=>{
          new Promise((resolve)=>{
            db.query("INSERT INTO tasks SET ? ", {
              users_id: req.session.users_id,
              category_id: categoryid,
              task_name: task_name,
              start_date: start_date,//.replace('Z', ''),
              end_date: end_date,//.replace('Z', ''),
              description: description,
              date_status: date_status,
              taskisfinished: 0,
              recent_update: new Date()},
              (error)=>{
                if(error)console.log(error)  
                resolve()  
              })
          }).then(()=>{
            db.query(
              "SELECT id, "+
              "category_name, "+
              "recent_update "+
              "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC", 
              (error, catres)=>{
                if(error)console.log(error)
                db.query(
                "SELECT id, "+
                "category_id, "+
                "task_name, "+
                "start_date, "+
                "end_date, "+
                "description, "+
                "date_status, "+
                "taskisfinished, "+
                "recent_update "+
                "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
                (error, tasres)=>{
                  if(error)console.log(error)
                  return res.json({
                    noCategory: noCategory,
                    categories: catres,
                    tasks: tasres
                  })
                })
              })
            })    
          }
        )
      })
    })
  } 
  else return handle(req, res)
})

router.post("/updatetask", (req, res) => {
  if (req.session.isAuth) {
    const { task_id, category_id, task_name, start_date, end_date, date_status, description } = req.body
    const current_server_date = new Date()
    new Promise((resolve) => {
      db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",{
      recent_update: current_server_date },
      (error)=>{
        if(error) console.log(error)
        db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '" +req.session.users_id+"' LIMIT 1",{
          users_id: req.session.users_id,
          category_id: category_id,
          task_name: task_name,
          start_date: start_date,//.replace('Z', ''),
          end_date: end_date,//.replace('Z', ''),
          description: description,
          date_status: date_status,
          recent_update: current_server_date},
          (error)=>{
            if(error)console.log(error) 
            resolve()
          }
        )
      })
    })
    .then(()=>{
      db.query(
      "SELECT id, "+
      "category_name, "+
      "recent_update "+
      "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query(
        "SELECT id, "+
        "category_id, "+
        "task_name, "+
        "start_date, "+
        "end_date, "+
        "description, "+
        "date_status, "+
        "taskisfinished, "+
        "recent_update "+
        "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
        (error, tasres)=>{
          if(error)console.log(error)
          db.query(
          "SELECT id, "+
          "category_id, "+
          "task_name, "+
          "start_date, "+
          "end_date, "+
          "description, "+
          "date_status, "+
          "taskisfinished, "+
          "recent_update "+
          "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC LIMIT 1", 
          (error, newtask) => {
            if(error) console.log(error)
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
      db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",{
      recent_update: current_server_date },
      (error)=>{
        if(error) console.log(error)
        db.query("DELETE FROM tasks WHERE ? AND users_id = '"+req.session.users_id+"' LIMIT 1",
          { id: task_id },
          (error)=>{
            if(error) console.log(error)
            resolve()
          })
        }
      )
    })
    .then(()=>{   
      db.query(
      "SELECT id, "+
      "category_name, "+
      "recent_update "+
      "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query(
        "SELECT id, "+
        "category_id, "+
        "task_name, "+
        "start_date, "+
        "end_date, "+
        "description, "+
        "date_status, "+
        "taskisfinished, "+
        "recent_update "+
        "from tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
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
    .then(()=>{
      db.query(
      "SELECT id, "+
      "category_name, "+
      "recent_update "+
      "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC", 
      (error, catres)=>{
        if(error)console.log(error)
        db.query(
        "SELECT id, "+
        "category_id, "+
        "task_name, "+
        "start_date, "+
        "end_date, "+
        "description, "+
        "date_status, "+
        "taskisfinished, "+
        "recent_update "+
        "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
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

router.post("/changetaskcompletionstatus", (req, res) => {
  if (req.session.isAuth) {
    const { task_id } = req.body
    new Promise((resolve)=>{
      db.query(
      "SELECT category_id,"+
      "taskisfinished "+
      "FROM tasks WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",
      (error, results)=>{
        if(error)console.log(error)
        resolve(results)
      })
    })
    .then((task)=>{
      new Promise((resolve)=>{
        const current_server_date = new Date()
        db.query("UPDATE category SET ? WHERE id = '"+task[0].category_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",
        {recent_update: current_server_date},
        (error)=>{
          if(error)console.log(error)
          const taskisfinished = !task[0].taskisfinished
          db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",
          { taskisfinished: taskisfinished }, 
          (error) => {
            if(error)console.log(error)
            resolve(task)
          })
        })
      })
      .then(()=>{
        db.query(
        "SELECT id, "+
        "category_name, "+
        "recent_update "+
        "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC", 
        (error, catres)=>{
          if(error)console.log(error)
          db.query(
          "SELECT id, "+
          "category_id, "+
          "task_name, "+
          "start_date, "+
          "end_date, "+
          "description, "+
          "date_status, "+
          "taskisfinished, "+
          "recent_update "+
          "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
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
      db.query("UPDATE tasks SET ? WHERE id = '"+task_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",
      { date_status: date_status }, 
      (error) => {
        if(error)console.log(error)
        resolve()
      })
    })
    .then(()=>{
      db.query(
      "SELECT id, "+
      "category_id, "+
      "task_name, "+
      "start_date, "+
      "end_date, "+
      "description, "+
      "date_status, "+
      "taskisfinished, "+
      "recent_update "+
      "FROM tasks WHERE users_id = '"+req.session.users_id+"' ORDER BY end_date ASC, id DESC",
      (error, tasres)=>{
        if(error)console.log(error)
        return res.json({
          tasks: tasres
        })
      })
    })
  } 
  else return handle(req, res)
})

module.exports = router

const express = require("express")
const router = express.Router()
const app = require("../../app.js")
const handle = app.getRequestHandler()
const db = require("../db").db

router.post("/addcategory", (req, res) => {
  if (req.session.isAuth) {
    const { category_name } = req.body
    if(category_name==="") return
    db.query("INSERT INTO category SET ? ",{
      users_id: req.session.users_id,
      category_name: category_name,
      recent_update: new Date() },
      (error)=>{if(error) console.log(error)
        db.query(
          "SELECT id, "+
          "category_name, "+
          "recent_update "+
          "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC",
          (error, catres)=>{if (error) console.log(error)
            return res.json({ categories: catres })
          }
        )
      }
    )
  } 
  else return handle(req, res)
})

router.post("/updatecategory", (req, res) => {
  if (req.session.isAuth) {
    const { category_name, category_id } = req.body
    const current_server_date = new Date()
    db.query("UPDATE category SET ? WHERE id = '"+category_id+"' AND users_id = '"+req.session.users_id+"' LIMIT 1",{
      category_name: category_name, 
      recent_update: current_server_date },
      (error)=>{
        if(error) console.log(error)
        db.query(
          "SELECT id, "+
          "category_name, "+
          "recent_update "+
          "FROM category WHERE users_id = '"+req.session.users_id +"' ORDER BY recent_update DESC, id DESC",
          (error, catres)=>{
            if(error) console.log(error)
            return res.json({ categories: catres })
          }
        )
      }
    )
  } 
  else return handle(req, res)
})

router.post("/deletecategory", (req, res) => {
  if (req.session.isAuth) {
    const { category_id } = req.body
    db.query("DELETE FROM category WHERE ? AND users_id = '"+req.session.users_id+"' LIMIT 1",{
      id: category_id },
      (error)=>{
        if(error) console.log(error)
        db.query("DELETE FROM tasks WHERE ?",{
          category_id: category_id },
          (error)=>{
            if (error) console.log(error)
            db.query(
              "SELECT id, "+
              "category_name, "+
              "recent_update "+
              "FROM category WHERE users_id = '"+req.session.users_id+"' ORDER BY recent_update DESC, id DESC",
              (error, catres)=> {
                if (error) console.log(error)
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
                  (error, tasres) => {
                    if (error) console.log(error)
                    return res.json({
                      categories: catres,
                      tasks: tasres
                    })
                  }
                )
              }
            )
          }
        )
      }
    )
  } 
  else return handle(req, res)
})

module.exports = router

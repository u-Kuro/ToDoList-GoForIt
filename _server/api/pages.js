const express = require("express")
const app = require("../../app.js")
const router = express.Router()

router.get("/", (req, res) => {
  if (req.session.isAuth) return app.render(req, res, "/home")
  else app.render(req, res, "/login")
})

router.get("/register", (req, res) => {
  if (req.session.isAuth) return app.render(req, res, "/home")
  else return app.render(req, res, "/register")
})

router.get("/login", (req, res) => {
  if (req.session.isAuth) return app.render(req, res, "/home")
  else return app.render(req, res, "/login")
})

router.get("/home", (req, res) => {
  if (req.session.isAuth) return app.render(req, res, "/home")
  else 
    return app.render(req, res, "/login", {
      haveAlert: true,
      message: "Unauthorized, Please Login first!",
    })
})

module.exports = router

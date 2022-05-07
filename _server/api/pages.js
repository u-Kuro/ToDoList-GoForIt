const express = require("express");
const app = require("../../app.js");
const router = express.Router();
const db = require("../db").db;

// router.get("/", (req, res) => {
//   if (req.session.isAuth) {
//     return res.redirect("/home");
//   }
//   return res.redirect("/login");
// });

router.get("/register", (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/home");
  }
  return app.render(req, res, "/register");
});

router.get("/login", (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/home");
  }
  return app.render(req, res, "/login");
});

router.get("/home", (req, res) => {
  if (req.session.isAuth) {
    db.query(
      "SELECT * FROM category WHERE users_id = ?",
      req.session.users_id,
      (error, catres) => {
        if (error) {
          console.log(error);
        }
        db.query(
          "SELECT * FROM tasks WHERE users_id = ? ORDER BY end_date ASC",
          req.session.users_id,
          (error, tasres) => {
            if (error) {
              console.log(error);
            }
            return app.render(req, res, "/home", {
              valid: true,
              username: req.session.username,
              categories: catres,
              tasks: tasres,
              ctz_offsethour: req.session.ctz_offsethour,
              ctz_offsetmin: req.session.ctz_offsetmin,
            });
          }
        );
      }
    );
  } else {
    return app.render(req, res, "/login", {
      haveAlert: true,
      message: "Unauthorized, Please Login first!",
    });
  }
});

module.exports = router;

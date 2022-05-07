const express = require("express");
const router = express.Router();
const app = require("../../app");
const handle = app.getRequestHandler();
const bcryptjs = require("bcryptjs");
const db = require("../db").db;

router.post("/register", (req, res) => {
  const { username, email, password, cpassword } = req.body;
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.json({
      message: "Please include an '@' in an email address.",
    });
  }
  db.query(
    "SELECT username, email FROM users WHERE username = '" +
      username +
      "' OR email = '" +
      email +
      "' LIMIT 2",
    async (error, usemres) => {
      if (error) {
        console.log(error);
      }
      if (usemres.length > 0) {
        if (usemres[0].username == username) {
          return res.json({
            message: "Username is already in use",
          });
        } else if (usemres[0].email == email) {
          return res.json({
            message: "Email is already in use",
          });
        } else {
          return res.json({
            message: "Username and Email is already in use",
          });
        }
      } else {
        if (password !== cpassword) {
          return res.json({
            message: "Passwords do not Match",
          });
        } else {
          var hashedPassword = await bcryptjs.hash(password, 8);
          db.query(
            "INSERT INTO users SET ? ",
            { username: username, email: email, password: hashedPassword },
            (error) => {
              if (error) {
                console.log(error);
              }
              res.json({
                username: username,
                message: "Account is Registered, you may Sign-in",
              });
            }
          );
        }
      }
    }
  );
});

router.post("/login", (req, res) => {
  const { useremail, password } = req.body;
  db.query(
    "SELECT password, id, username FROM users WHERE email = '" +
      useremail +
      "' OR username = '" +
      useremail +
      "' LIMIT 1",
    async (error, usemres) => {
      if (error) {
        console.log(error);
      }
      if (usemres.length > 0) {
        const accountisValid = await bcryptjs.compare(
          password,
          usemres[0].password
        );
        if (accountisValid) {
          req.session.isAuth = true; // Allows User Session
          req.session.username = usemres[0].username;
          req.session.users_id = usemres[0].id;
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
                  return res.json({ valid: true });
                }
              );
            }
          );
        } else {
          return res.json({
            valid: false,
            messagecolor: "red",
            message: "Password is Incorrect",
          });
        }
      } else {
        return res.json({
          valid: false,
          messagecolor: "red",
          message: "Account is Not Registered",
        });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  req.sessionStore.close();
  res.clearCookie(process.env.sess_key);
  res.send({});
});

router.get("/userdata", (req, res) => {
  if (req.session.isAuth) {
    db.query(
      "SELECT * FROM category WHERE users_id = '" +
        req.session.users_id +
        "' ORDER BY recent_update DESC",
      (error, catres) => {
        if (error) {
          console.log(error);
        }
        db.query(
          "SELECT * FROM tasks WHERE users_id = '" +
            req.session.users_id +
            "' ORDER BY end_date ASC",
          (error, tasres) => {
            if (error) {
              console.log(error);
            }
            return res.send({
              isAuth: true,
              username: req.session.username,
              categories: catres,
              tasks: tasres,
            });
          }
        );
      }
    );
  } else {
    return handle(req, res);
  }
});

module.exports = router;

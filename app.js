const express = require("express")
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session)
const next = require("next")
const path = require("path")
const request = require("request")
const db = require("./_server/db").db
require("dotenv").config()

const dev = process.env.node_env !== "production"
const port = process.env.server_port || "5500"
const app = next({ dev })
const server = express()
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  // Create Server
  server.listen(port, (err) => {
    if (err) throw err
    else console.log("Server started on port " + port)
  })

  // Set Directories
  const publicdir = path.join(__dirname, "/_client/static")

  // Use Static and Json
  server.use(express.json())
  server.use(express.urlencoded({ extended: false }))
  server.use(express.static(publicdir))

  // Create Session (Always on Top of Routes)
  var sessionStore = new MySQLStore({
    host: process.env.database_host || "localhost",
    port: process.env.database_port || "3306",
    user: process.env.database_user || "root",
    database: process.env.database || "gfi_v1",
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 10,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },db)

  server.use(
    session({
      name: process.env.sess_name || "zxcnjncabcajsbkadnckajdndhbkajnk",
      secret: process.env.sess_secret || "dasjdaksdnsanfASFTEFkajdnknsadakj",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    })
  )

  // Define Routes
  server.use("/", require("./_server/api/pages"))
  server.use("/auth", require("./_server/api/auth"))
  server.use("/category", require("./_server/api/category"))
  server.use("/task", require("./_server/api/task"))

  server.get("*", (req, res) => {
    return handle(req, res)
  })

  // Check Database Connection
  db.getConnection((error) => {
    if (error) console.log(error)
    else console.log("MYSQL Connected...")
  })

  // Keep The Server Running, Errors on Backend
  process.on("uncaughtException", function (err) {
    console.log(err)
  })

  /// Ping Deployed App
  const ping = () =>request("https://todolist-goforit.herokuapp.com/",() => {})
  setInterval(function () {
    ping
  }, 60 * 1000) // Ping Website every 1 min
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

module.exports = app

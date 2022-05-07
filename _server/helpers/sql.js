const db = require("../db");

module.exports = {
  // User Update in Different Sessions
  user_update: (user_update = (users_id) => {
    db.query(
      "UPDATE users SET ? WHERE id = '" + users_id + "'",
      { recent_update: new Date() },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }),
  sqlTimezoneOfsett: (sqlTimezoneOfsett = () => {
    db.query(
      "SELECT TIME_FORMAT(TIMEDIFF(NOW(), UTC_TIMESTAMP),'%H:%i') AS TimzoneOffset",
      (reqs, sql) => {
        const sqloffset = sql[0].TimzoneOffset.split(":");
        const sqlhouroffset = parseInt(sqloffset[0]);
        const sqlminoffset =
          sqlhouroffset < 0 ? -parseInt(sqloffset[1]) : parseInt(sqloffset[1]);
      }
    );
  }),
};

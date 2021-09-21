const mysql = require("mysql");
var util = require("util");

// const pool = mysql.createPool({
//   host: "db",
//   port: 3306,
//   database: "baza",
//   user: "root",
//   password: "lozinka123",
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  database: "baza",
  user: "root",
  password: "lozinka123",
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) {
    connection.release();
    console.log("mysql connected");
  }

  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;

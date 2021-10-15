const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  database: "baza",
  user: "root",
  password: "lozinka123",
});

async function pingDB() {
  try {
    const connection = await pool.getConnection();

    if (connection) {
      connection.release();
      console.log("mysql connected");
    }
  } catch (err) {
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
  }
}
pingDB();

module.exports = pool;

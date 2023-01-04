const mysql = require("mysql2/promise");
//proslineki=138.3.250.151
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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

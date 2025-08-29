const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",      // अपना MySQL username
  password: "",       // अपना MySQL password
  database: "marketpulse360"
});

module.exports = pool;

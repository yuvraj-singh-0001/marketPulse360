const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = require("./config/db"); // ✅. MySQL pool (promise-based)
const routes = require('./routes/routes'); // Import routes
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the frontend and permit credentials (cookies)
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Test DB connection
const testDBConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL Database!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
};


// API routes
app.use('/api', routes);


// ✅ Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDBConnection();

});

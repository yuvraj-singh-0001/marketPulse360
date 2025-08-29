const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "market-pulser-360",
});

// ✅ Auto-create table if it doesn't exist
const createTableIfNotExists = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS register (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err.message);
    } else {
      console.log("✅ Register table is ready!");
    }
  });
};

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
  createTableIfNotExists(); // Create table after connection
});

// ✅ Register API (with password hashing)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = "INSERT INTO register (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ Error inserting data:", err.message);
        return res.status(500).json({ message: "Database error: " + err.message });
      }
      res.json({ message: "✅ User registered successfully!" });
    });
  } catch (error) {
    console.error("❌ Password hashing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const query = "SELECT * FROM register WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("❌ Database error:", err.message);
      return res.status(500).json({ message: "Database error: " + err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const user = results[0];
    
    try {
      // Compare provided password with hashed password in database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        res.json({ 
          message: "✅ Login successful!", 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email 
          } 
        });
      } else {
        res.status(401).json({ message: "❌ Invalid email or password" });
      }
    } catch (error) {
      console.error("❌ Password comparison error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
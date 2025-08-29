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

// ✅ Auto-create tables if they don't exist
const createTablesIfNotExists = () => {
  // Register table
  const createRegisterTable = `
    CREATE TABLE IF NOT EXISTS register (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Deliveries table
  const createDeliveriesTable = `
    CREATE TABLE IF NOT EXISTS deliveries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      delivery_address TEXT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      delivery_date DATE NOT NULL,
      special_instructions TEXT,
      status ENUM('pending', 'processing', 'delivered') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createRegisterTable, (err) => {
    if (err) {
      console.error("❌ Error creating register table:", err.message);
    } else {
      console.log("✅ Register table is ready!");
    }
  });
  
  db.query(createDeliveriesTable, (err) => {
    if (err) {
      console.error("❌ Error creating deliveries table:", err.message);
    } else {
      console.log("✅ Deliveries table is ready!");
    }
  });
};

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
  createTablesIfNotExists(); // Create tables after connection
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

// ✅ Delivery Form API Routes

// Get all deliveries
app.get('/deliveries', (req, res) => {
  const query = "SELECT * FROM deliveries ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching deliveries:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// Create new delivery
app.post('/deliveries', (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    product_name,
    quantity,
    delivery_date,
    special_instructions
  } = req.body;

  // Basic validation
  if (!customer_name || !customer_email || !customer_phone || !delivery_address || !product_name || !quantity || !delivery_date) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  const query = `
    INSERT INTO deliveries 
    (customer_name, customer_email, customer_phone, delivery_address, product_name, quantity, delivery_date, special_instructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    product_name,
    quantity,
    delivery_date,
    special_instructions || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error creating delivery:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ 
      message: "✅ Delivery order created successfully!", 
      deliveryId: result.insertId 
    });
  });
});

// Update delivery status
app.put('/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE deliveries SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating delivery:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "✅ Delivery status updated successfully!" });
  });
});

// Delete delivery
app.delete('/deliveries/:id', (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM deliveries WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting delivery:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "✅ Delivery deleted successfully!" });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
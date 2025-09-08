const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = require("./config/db"); // ✅. MySQL pool (promise-based)
const routes = require('./routes/routes'); // Import routes
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// ✅ Auto-create tables
const createTablesIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS register (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
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
    `);

    console.log("✅ Tables are ready!");
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  }
};



// ✅ Get all deliveries
app.get("/deliveries", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM deliveries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching deliveries:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Create new delivery
app.post("/deliveries", async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    product_name,
    quantity,
    delivery_date,
    special_instructions,
  } = req.body;

  if (
    !customer_name ||
    !customer_email ||
    !customer_phone ||
    !delivery_address ||
    !product_name ||
    !quantity ||
    !delivery_date
  ) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO deliveries 
       (customer_name, customer_email, customer_phone, delivery_address, product_name, quantity, delivery_date, special_instructions) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        product_name,
        quantity,
        delivery_date,
        special_instructions || null,
      ]
    );

    res.json({ message: "✅ Delivery order created successfully!", deliveryId: result.insertId });
  } catch (err) {
    console.error("❌ Error creating delivery:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Update delivery (full edit)
app.put("/deliveries/:id", async (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    product_name,
    quantity,
    delivery_date,
    special_instructions,
    status,
  } = req.body;

  try {
    await pool.query(
      `UPDATE deliveries 
       SET customer_name=?, customer_email=?, customer_phone=?, delivery_address=?, 
           product_name=?, quantity=?, delivery_date=?, special_instructions=?, status=? 
       WHERE id=?`,
      [
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        product_name,
        quantity,
        delivery_date,
        special_instructions || null,
        status || "pending",
        id,
      ]
    );
    res.json({ message: "✅ Delivery updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating delivery:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Delete delivery
app.delete("/deliveries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM deliveries WHERE id = ?", [id]);
    res.json({ message: "✅ Delivery deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting delivery:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});
// API routes
app.use('/api', routes);


// ✅ Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDBConnection();
  await createTablesIfNotExists();
});

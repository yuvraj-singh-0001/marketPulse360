const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = require("./config/db"); // ✅ Import pool (promise-based)

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

// ✅ Auto-create tables if they don't exist
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

// ✅ Register API
// ✅ Register API (with hashing)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 👇 hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO register (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "✅ User registered successfully!" });
  } catch (err) {
    console.error("❌ Error inserting data:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Login API (plain password check)
// ✅ Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM register WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    res.json({
      message: "✅ Login successful!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


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

// ✅ Update delivery status
app.put("/deliveries/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE deliveries SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "✅ Delivery status updated successfully!" });
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

// ✅ Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDBConnection();
  await createTablesIfNotExists();
});

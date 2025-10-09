const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

// ✅ Get all deliveries
const  getdeliveries = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM deliveries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching deliveries:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};
module.exports = { getdeliveries };
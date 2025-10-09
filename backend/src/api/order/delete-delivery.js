const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

// ✅ Delete delivery
const   deletedeliveries = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM deliveries WHERE id = ?", [id]);
    res.json({ message: "✅ Delivery deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting delivery:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};
module.exports = {deletedeliveries};
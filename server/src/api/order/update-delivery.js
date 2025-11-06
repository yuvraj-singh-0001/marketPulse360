const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

// ✅ Update delivery (full edit)
const updatedeliveries = async (req, res) => {
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
};
module.exports = { updatedeliveries };
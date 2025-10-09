const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

// ✅ Create new delivery
const deliveries = async (req, res) => {
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
};

module.exports = {deliveries};
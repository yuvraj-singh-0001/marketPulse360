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

module.exports = {deliveries, getdeliveries,updatedeliveries ,deletedeliveries};
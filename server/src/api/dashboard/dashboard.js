// controllers/dashboard.js
const pool = require("../../config/db");

const dashboard = async (req, res) => {
  try {
    const [totalDeliveries] = await pool.query(`SELECT COUNT(*) as count FROM deliveries`);
    const [pending] = await pool.query(`SELECT COUNT(*) as count FROM deliveries WHERE status='pending'`);
    const [processing] = await pool.query(`SELECT COUNT(*) as count FROM deliveries WHERE status='processing'`);
    const [delivered] = await pool.query(`SELECT COUNT(*) as count FROM deliveries WHERE status='delivered'`);
    const [today] = await pool.query(`SELECT COUNT(*) as count FROM deliveries WHERE delivery_date = CURDATE()`);

    res.json({
      totalDeliveries: totalDeliveries[0].count,
      pending: pending[0].count,
      processing: processing[0].count,
      delivered: delivered[0].count,
      today: today[0].count,
    });
  } catch (error) {
    console.error("Error in dashboard controller:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = dashboard;

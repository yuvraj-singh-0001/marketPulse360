const express = require("express");
const router = express.Router();

const delivery = require("../../api/order/delivery");

router.post("/deliveries", delivery);

module.exports = router;
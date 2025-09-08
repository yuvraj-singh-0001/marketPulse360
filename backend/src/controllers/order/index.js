const express = require("express");
const router = express.Router();

const {deliveries, getdeliveries} = require("../../api/order/delivery");


router.post("/deliveries", deliveries);
router.get("/getdeliveries", getdeliveries);

module.exports = router;
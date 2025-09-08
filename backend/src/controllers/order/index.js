const express = require("express");
const router = express.Router();

const {deliveries, getdeliveries,updatedeliveries,deletedeliveries} = require("../../api/order/delivery");



router.post("/deliveries", deliveries);
router.get("/getdeliveries", getdeliveries);
router.put("/updatedeliveries/:id", updatedeliveries);
router.delete("/deletedeliveries/:id", deletedeliveries);

module.exports = router;
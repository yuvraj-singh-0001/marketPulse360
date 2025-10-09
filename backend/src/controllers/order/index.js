const express = require("express");
const router = express.Router();

const {deliveries} = require("../../api/order/add-delivery");
const {updatedeliveries} = require("../../api/order/update-delivery");
const {getdeliveries} = require("../../api/order/get-delivery");
const {deletedeliveries} = require("../../api/order/delete-delivery");


router.post("/deliveries", deliveries);
router.get("/getdeliveries", getdeliveries);
router.put("/updatedeliveries/:id", updatedeliveries);
router.delete("/deletedeliveries/:id", deletedeliveries);

module.exports = router;
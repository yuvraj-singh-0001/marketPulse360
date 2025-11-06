const express = require("express");
const router = express.Router();

const dashboard = require("../../api/dashboard/dashboard");



router.get("/stats", dashboard);

module.exports = router;
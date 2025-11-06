const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth/index');
const order = require('../controllers/order/index');
const dashboard = require('../controllers/dashboard/index');

router.use('/dashboard', dashboard);
router.use('/orders', order);
router.use('/auth', auth);


module.exports = router;    
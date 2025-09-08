const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth/index');
const order = require('../controllers/order/index');

router.use('/orders', order);
router.use('/auth', auth);


module.exports = router;    
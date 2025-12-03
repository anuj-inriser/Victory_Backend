const express = require('express');
const { cancelOrder } = require('../controllers/orderCancel.controller');
const router = express.Router();

router.post('/',cancelOrder)

module.exports = router;
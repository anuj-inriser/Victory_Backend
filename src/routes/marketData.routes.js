const express = require('express');
const { getMarketData } = require('../controllers/marketData.controller.js');

const router = express.Router();

router.get('/market-data', getMarketData);

module.exports = router;

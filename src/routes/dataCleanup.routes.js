const express = require('express');
const { clearPriceTicks, clearCandles, clearAllData } = require('../controllers/dataCleanup.controller.js');

const router = express.Router();

// Clear old data endpoints
router.post('/clear-ticks', clearPriceTicks);
router.post('/clear-candles', clearCandles);
router.post('/clear-all', clearAllData);

module.exports = router;

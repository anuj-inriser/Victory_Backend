const express = require('express');
const { getPrices, postPrice, getHistory, getLatestPrice } = require('../controllers/price.controller.js');

const router = express.Router();

router.get('/prices', getPrices);
router.get('/prices/latest', getLatestPrice);
router.post('/prices', postPrice);
router.get('/history', getHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { fetchAndSaveInsider } = require('../controllers/insiderTradingController');

// GET /api/insidertrading/fetch → manual trigger
router.get('/fetch', fetchAndSaveInsider);

module.exports = router;

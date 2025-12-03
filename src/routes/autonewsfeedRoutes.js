const express = require('express');
const router = express.Router();
const { fetchAndSaveNews } = require('../controllers/autonewsfeedController');

// POST /api/news/fetch → manual trigger
router.get('/fetch', fetchAndSaveNews);

module.exports = router;
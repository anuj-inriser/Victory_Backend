const express = require('express');
const { getHealth } = require('../controllers/health.controller.js');

const router = express.Router();

router.get('/health', getHealth);

module.exports = router;

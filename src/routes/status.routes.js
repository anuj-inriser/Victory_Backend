const express = require('express');
const { getWebSocketStatus } = require('../controllers/status.controller.js');

const router = express.Router();

router.get('/status', getWebSocketStatus);

module.exports = router;

const express = require('express');
const { getAvailableSymbols } = require('../controllers/symbols.controller.js');

const router = express.Router();

router.get('/', getAvailableSymbols);

module.exports = router;

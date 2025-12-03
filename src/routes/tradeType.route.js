const express = require('express');
const { getTradeType, getByIdSTradeType } = require('../controllers/tradeType.controller');
const router = express.Router();

router.get('/', getTradeType)

router.get('/:id', getByIdSTradeType)

module.exports = router
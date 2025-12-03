const express = require('express');
const { getPrefStocks, getByIdPrefStocks } = require('../controllers/prefStocks.controller');
const router = express.Router();

router.get('/', getPrefStocks)

router.get('/:id', getByIdPrefStocks)

module.exports = router
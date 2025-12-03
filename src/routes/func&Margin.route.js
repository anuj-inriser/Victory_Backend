const express = require('express');
const { fundAndMargin } = require('../controllers/fund&Margin.controller');
const router = express.Router();

router.get('/',fundAndMargin)

module.exports = router;
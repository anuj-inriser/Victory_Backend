const { getTopMovers } = require('../controllers/movers.controller');
const express = require('express');

const router = express.Router();

router.get('/', getTopMovers);

module.exports = router;

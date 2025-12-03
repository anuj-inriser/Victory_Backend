const express = require('express');
const { getAllTermTypes } = require('../controllers/termTypes.controller');
const router = express.Router();

router.get('/', getAllTermTypes);

module.exports = router;
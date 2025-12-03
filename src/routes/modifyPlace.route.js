const express = require('express');
const { modifyeOrder } = require('../controllers/orderModify.controller');
const router = express.Router();

router.post('/',modifyeOrder)

module.exports = router;
const express = require('express');
const { saveToken } = require('../controllers/savetoken.controller');
const router = express.Router();

router.post('/',saveToken )

module.exports = router;
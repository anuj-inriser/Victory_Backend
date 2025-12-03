const express = require('express');
const { saveGetProfile } = require('../controllers/saveGetProfle.controller');
const router = express.Router();

router.get('/',saveGetProfile)

module.exports = router;
// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const  {checkUserExists, logout}  = require('../controllers/authController');

router.post('/', checkUserExists);
router.post("/logout", logout);

module.exports = router;
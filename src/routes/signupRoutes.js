// routes/signupRoutes.js
const express = require("express");
const router = express.Router();
const { signupController } = require("../controllers/signupController.js");

// POST /api/signup
router.post("/", signupController);

module.exports = router;

const express = require("express");
const { getAllScript } = require("../controllers/script.controller");
const router = express.Router();

router.get('/', getAllScript)

module.exports = router;
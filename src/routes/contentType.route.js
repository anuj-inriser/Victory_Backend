const express = require("express");
const { getAllContentTypes } = require("../controllers/contentType.controller");
const router = express.Router();

// GET all content types
router.get("/", getAllContentTypes);

module.exports = router;
const express = require("express");
const { getAllContentLinkages } = require("../controllers/contentLinkage.controller");
const router = express.Router();

// GET all content linkages
router.get("/", getAllContentLinkages);

module.exports = router;
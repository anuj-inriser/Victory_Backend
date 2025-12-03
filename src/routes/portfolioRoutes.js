const express = require("express");
const router = express.Router();
const { getPortfolio } = require("../controllers/portfolioController");

router.get("/get", getPortfolio);

module.exports = router;
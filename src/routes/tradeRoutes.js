const express = require("express");
const router = express.Router();
const { getTrade } = require("../controllers/tradeController");

router.get("/get", getTrade);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getFundsAndMargin } = require("../controllers/fundController");

router.get("/fundandmargin/get", getFundsAndMargin);

module.exports = router;

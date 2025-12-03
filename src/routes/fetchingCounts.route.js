const express = require("express");
const { fetchingCounts } = require("../controllers/fetchingCounts.controller");
const router = express.Router();

router.get("/", fetchingCounts);

module.exports = router;

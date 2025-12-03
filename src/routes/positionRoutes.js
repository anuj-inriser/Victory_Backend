const express = require("express");
const router = express.Router();
const { getPosition } = require("../controllers/positionController");

router.get("/get", getPosition);

module.exports = router;
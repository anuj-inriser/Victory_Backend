const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/brokerageController");

router.get("/calculate", ctrl.calculateBrokerage);

module.exports = router;

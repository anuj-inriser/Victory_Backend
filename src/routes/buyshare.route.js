// routes/buyshare.route.js
const express = require("express");
const router = express.Router();
const buyshareController = require("../controllers/buyshare.controller.js");

// 🟢 POST - place order
router.post("/create", buyshareController.createOrder);

// 🔵 GET - search symbol
router.get("/search", buyshareController.searchSymbol);

module.exports = router;
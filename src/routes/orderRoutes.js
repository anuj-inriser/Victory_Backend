const express = require("express");
const router = express.Router();
const { placeOrder, getOrder, cancelOrder, modifyOrder } = require("../controllers/orderController");

router.post("/cancel/:orderid", cancelOrder);
router.post("/place", placeOrder);
router.post("/modify", modifyOrder);
router.get("/get", getOrder);

module.exports = router;
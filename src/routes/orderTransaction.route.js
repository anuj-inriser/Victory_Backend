const express = require("express");
const { getAllOrderTransactions, getOrderTransactionById, createOrderTransaction, updateOrderTransaction, deleteOrderTransaction } = require("../controllers/orderTransaction.controller");
const router = express.Router();

router.get("/", getAllOrderTransactions);
router.get("/:id", getOrderTransactionById);
router.post("/", createOrderTransaction);
router.put("/:id", updateOrderTransaction);
router.delete("/:id", deleteOrderTransaction);

module.exports = router;

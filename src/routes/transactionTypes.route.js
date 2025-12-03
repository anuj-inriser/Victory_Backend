const express = require("express");
const {
  getAllTransactionTypes,
  getTransactionTypeById,
} = require("../controllers/transactionTypes.controller");
const router = express.Router();

router.get("/", getAllTransactionTypes);

router.get("/:id", getTransactionTypeById);

module.exports = router;

const express = require("express");
const {
  getAllAffiliateTransactions,
  getAffiliateTransactionById,
  createAffiliateTransaction,
  updateAffiliateTransaction,
  deleteAffiliateTransaction,
} = require("../controllers/affiliateTransactions.controller");
const router = express.Router();

router.get("/", getAllAffiliateTransactions);

router.get("/:id", getAffiliateTransactionById);

router.post("/", createAffiliateTransaction);

router.put("/:id", updateAffiliateTransaction);

router.delete("/:id", deleteAffiliateTransaction);

module.exports = router;

const express = require("express");
const {
  getAllAffiliateBalances,
  getAffiliateBalanceById,
  createAffiliateBalance,
  updateAffiliateBalance,
  deleteAffiliateBalance,
} = require("../controllers/affiliateBalance.controller");
const router = express.Router();

router.get("/", getAllAffiliateBalances);

router.get("/:user_id", getAffiliateBalanceById);

router.post("/", createAffiliateBalance);

router.put("/:user_id", updateAffiliateBalance);

router.delete("/:user_id", deleteAffiliateBalance);

module.exports = router;

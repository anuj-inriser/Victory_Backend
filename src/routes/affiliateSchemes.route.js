const express = require("express");
const {
  getAffiliateSchemeById,
  getAllAffiliateSchemes,
  createAffiliateScheme,
  updateAffiliateScheme,
  deleteAffiliateScheme,
} = require("../controllers/affiliateSchemes.controller");

const router = express.Router();

router.get("/", getAllAffiliateSchemes);

router.get("/:id", getAffiliateSchemeById);

router.post("", createAffiliateScheme);

router.put("/:id", updateAffiliateScheme);

router.delete("/:id", deleteAffiliateScheme);

module.exports = router;

const express = require("express");
const {
  getAllBenefitTypes,
  getBenefitTypeById,
} = require("../controllers/benefitType.controller");
const router = express.Router();

router.get("/", getAllBenefitTypes);

router.get("/:id", getBenefitTypeById);

module.exports = router;

const express = require("express");
const {
  getAllBadgesProgramme,
  getBadgeProgrammeById,
  createBadgeProgramme,
  updateBadgeProgramme,
  deleteBadgeProgramme,
} = require("../controllers/badgesProgramme.controller");
const router = express.Router();

router.get("/", getAllBadgesProgramme);

router.get("/:id", getBadgeProgrammeById);

router.post("/", createBadgeProgramme);

router.put("/:id", updateBadgeProgramme);

router.delete("/:id", deleteBadgeProgramme);

module.exports = router;

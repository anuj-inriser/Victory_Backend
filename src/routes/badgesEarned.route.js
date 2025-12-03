const express = require("express");
const {
  getAllBadgesEarned,
  getBadgeEarnedById,
  createBadgeEarned,
  updateBadgeEarned,
  deleteBadgeEarned,
} = require("../controllers/badgesEarned.controller");
const router = express.Router();

router.get("/", getAllBadgesEarned);

router.get("/:id", getBadgeEarnedById);

router.post("/", createBadgeEarned);

router.put("/:id", updateBadgeEarned);

router.delete("/:id", deleteBadgeEarned);

module.exports = router;

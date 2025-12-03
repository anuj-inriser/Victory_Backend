const express = require("express");
const router = express.Router();
const {
  getAllLikesDislikes,
  getLikesDislikesById,
  createLikesDislikes,
  updateLikesDislikes,
  deleteLikesDislikes,
} = require("../controllers/likeDislikes.controller.js");

router.get("/", getAllLikesDislikes);
router.get("/:id", getLikesDislikesById);
router.post("/", createLikesDislikes);
router.put("/:id", updateLikesDislikes);
router.delete("/:id", deleteLikesDislikes);

module.exports = router;

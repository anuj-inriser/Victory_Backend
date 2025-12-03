const express = require("express");
const router = express.Router();
const {
  getAllContentWishlist,
  getContentWishlistById,
  createContentWishlist,
  updateContentWishlist,
  deleteContentWishlist,
} = require("../controllers/contentWishlisted.controller.js");

router.get("/", getAllContentWishlist);
router.get("/:id", getContentWishlistById);
router.post("/", createContentWishlist);
router.put("/:id", updateContentWishlist);
router.delete("/:id", deleteContentWishlist);

module.exports = router;

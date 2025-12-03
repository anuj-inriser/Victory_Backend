const express = require("express");
const { getAllWishlistControlTable, getWishlistControlTableById, createWishlistControlTable, updateWishlistControlTable, deleteWishlistControlTable, addToWatchlist, getWatchlistStocks,removeFromWatchlist } = require("../controllers/wishlistControlTable.controller");
const router = express.Router();

router.get('/stocks', getWatchlistStocks);
router.get('/',getAllWishlistControlTable)
router.get("/:id", getWishlistControlTableById);
router.post("/", createWishlistControlTable);
router.put("/:id", updateWishlistControlTable);
router.delete("/:id", deleteWishlistControlTable);
router.post('/add', addToWatchlist);
router.post('/remove', removeFromWatchlist);

module.exports = router;
const express = require("express");
const {
  getAllNewsFeeds,
  getNewsFeedById,
  createNewsFeed,
  updateNewsFeed,
  deleteNewsFeed,
  getNewsCategories,
  publishNewsFeed,
  getPublishedNewsFeed,
} = require("../controllers/newsFeed.controller");
const upload = require("../middleware/uploadFiles.middleware");
const router = express.Router();

router.get("/published", getPublishedNewsFeed);
router.get("/", getAllNewsFeeds);
router.get("/categories", getNewsCategories);
router.put("/publish/:id", publishNewsFeed)

router.get("/:id", getNewsFeedById);

router.post("/", upload.single("image_url"), createNewsFeed);

router.put("/:id", upload.single("image_url"), updateNewsFeed);

router.delete("/:id", deleteNewsFeed);

module.exports = router;

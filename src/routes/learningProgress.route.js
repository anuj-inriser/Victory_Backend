const express = require("express");
const {
  updateProgress,
  getModuleProgress,
  getChapterProgressSummary
} = require("../controllers/learningProgress.controller");

const router = express.Router();

router.post("/update", updateProgress); 
router.get("/module/:userId/:moduleId", getModuleProgress);
router.get("/summary/:userId/:moduleId", getChapterProgressSummary);

module.exports = router;

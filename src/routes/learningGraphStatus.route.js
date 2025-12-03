const express = require("express");
const { getAllLearningGraphStatus } = require("../controllers/learningGraphStatus.controller");
const router = express.Router();

router.get('/',getAllLearningGraphStatus)

module.exports = router;
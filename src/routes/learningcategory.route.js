const express = require("express")


const {
    getAllLearningCategory
} = require("../controllers/learningCategory.controller");

const router = express.Router();


router.get('/', getAllLearningCategory)

module.exports = router;
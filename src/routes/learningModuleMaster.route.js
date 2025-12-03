const express = require("express");
const { getAllLearningModules, getLearningModuleById, createLearningModule, updateLearningModule, deleteLearningModule } = require("../controllers/learningModules.controller.js");
const upload = require("../middleware/uploadFiles.middleware.js");
const router = express.Router();

router.get('/', getAllLearningModules)

router.get('/:id', getLearningModuleById)

router.post('/', upload.single("moduleimage"), createLearningModule)

router.put('/:id', upload.single("moduleimage"), updateLearningModule)

router.delete('/:id', deleteLearningModule)

module.exports = router;
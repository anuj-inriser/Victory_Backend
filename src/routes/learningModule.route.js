const express = require("express")
const {
    createLearningModule,
    getAllLearningModules,
    deleteLearningModule,
    updateLearningModule,
    getLearningModuleById,
    getChapterDetailsChapterScreen
} = require("../controllers/learningModule.controller")

const router = express.Router();


router.post('/', createLearningModule)
router.get('/', getAllLearningModules)
router.get('/chapter/:id', getChapterDetailsChapterScreen)
router.get('/:id', getLearningModuleById)
router.put('/:id', updateLearningModule)

router.delete('/:id', deleteLearningModule)
module.exports = router;
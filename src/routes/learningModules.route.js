const express = require("express")
const {
    createLearningModule,
    getAllLearningModules,
    deleteLearningModule,
    updateLearningModule,
    getLearningModuleById,
    getLearningModuleByCategory
} = require("../controllers/learningModules.controller");
const upload = require("../middleware/uploadFiles.middleware");

const router = express.Router();


router.post('/', upload.single('moduleimage'), createLearningModule)
router.get('/', getAllLearningModules)
router.get('/category/:id', getLearningModuleByCategory)
router.get('/:id', getLearningModuleById)
router.put('/:id', upload.single('moduleimage'), updateLearningModule)

router.delete('/:id', deleteLearningModule)
module.exports = router;
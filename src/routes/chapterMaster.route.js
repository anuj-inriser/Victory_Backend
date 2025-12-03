const express = require("express");
const {
    getAllChapterMaster,
    getChapterMasterById,
    createChapterMaster,
    updateChapterMaster,
    deleteChapterMaster,
    getChapterMasterByModuleId
}
    = require("../controllers/chapterMaster.controller");

const router = express.Router();

router.get('/', getAllChapterMaster)
router.get('/module/:id', getChapterMasterByModuleId)

router.get('/:id', getChapterMasterById)

router.post('/', createChapterMaster)

router.put('/:id', updateChapterMaster)

router.delete('/:id', deleteChapterMaster)

module.exports = router;
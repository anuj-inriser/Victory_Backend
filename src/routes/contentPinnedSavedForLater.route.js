const express = require('express');
const { getAllContentPinnedSavedForLater, getContentPinnedSavedForLaterById, createContentPinnedSavedForLater, updateContentPinnedSavedForLater, deleteContentPinnedSavedForLater } = require('../controllers/contentPinnedSavedForLater.controller');
const router = express.Router();

router.get('/',getAllContentPinnedSavedForLater)

router.get('/:id',getContentPinnedSavedForLaterById)

router.post('/',createContentPinnedSavedForLater)

router.put('/:id',updateContentPinnedSavedForLater)

router.delete('/:id',deleteContentPinnedSavedForLater)

module.exports = router;
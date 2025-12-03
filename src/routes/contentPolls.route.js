const express = require('express');
const { getAllContentPolls, getContentPollsById, createContentPolls, updateContentPolls, deleteContentPolls } = require('../controllers/contentPolls.controller');
const router = express.Router();

router.get('/',getAllContentPolls)

router.get('/:id',getContentPollsById)

router.post('/',createContentPolls)

router.put('/:id',updateContentPolls)

router.delete('/:id',deleteContentPolls)

module.exports = router;
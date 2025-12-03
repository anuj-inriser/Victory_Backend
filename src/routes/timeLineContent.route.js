const express = require('express');
const { getTimeLineContent, getByIdTimeLineContent } = require('../controllers/timeLineContent.controller');
const router = express.Router();

router.get('/', getTimeLineContent)

router.get('/:id', getByIdTimeLineContent)

module.exports = router
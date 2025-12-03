const express = require('express');
const { getExitType, getByIdExitType } = require('../controllers/exitType.controller');
const router = express.Router();

router.get('/', getExitType)

router.get('/:id', getByIdExitType)

module.exports = router
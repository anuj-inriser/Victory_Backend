const express = require('express');
const { getScriptType, getByIdScriptType } = require('../controllers/scriptType.controller');
const router = express.Router();

router.get('/', getScriptType)

router.get('/:id', getByIdScriptType)

module.exports = router
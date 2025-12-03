const express = require('express');
const { getScriptTable, getByIdScriptTable } = require('../controllers/scriptTable.controller');
const router = express.Router();

router.get('/', getScriptTable)

router.get('/:id', getByIdScriptTable)

module.exports = router
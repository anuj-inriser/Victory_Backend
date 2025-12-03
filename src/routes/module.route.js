const express = require('express');
const { getAllModules, getModuleById } = require('../controllers/module.controller');
const router = express.Router();

router.get('/',getAllModules );
router.get('/:id', getModuleById);

module.exports = router;

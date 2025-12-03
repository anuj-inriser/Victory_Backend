const express = require('express');
const { getAllActions, getActionById } = require('../controllers/action.controller');
const router = express.Router();

router.get('/', getAllActions);
router.get('/:id', getActionById);

module.exports = router;

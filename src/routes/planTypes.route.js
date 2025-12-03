const express = require('express');
const { getAllPlanTypes } = require('../controllers/planTypes.controller');
const router = express.Router();

router.get('/',getAllPlanTypes)

module.exports = router;
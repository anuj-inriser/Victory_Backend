const express = require('express');
const { getAllPlanActivationTypes } = require('../controllers/planActivationType.controller');
const router = express.Router();

router.get('/',getAllPlanActivationTypes)

module.exports = router;
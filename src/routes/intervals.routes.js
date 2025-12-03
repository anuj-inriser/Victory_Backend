const express = require('express');
const { fetchIntervalData, fetchAllIntervals } = require('../controllers/intervals.controller.js');

const router = express.Router();

// Order matters! Specific before general
router.get('/intervals/all', fetchAllIntervals);
router.get('/intervals', fetchIntervalData);

module.exports = router;

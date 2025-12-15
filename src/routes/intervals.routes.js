const express = require('express');
const { fetchIntervalData, fetchAllIntervals, saveIntervalData } = require('../controllers/intervals.controller.js');

const router = express.Router();

// Order matters! Specific before general
router.get('/intervals/all', fetchAllIntervals);
router.get('/intervals', fetchIntervalData);

// New POST route for saving data
router.post('/intervals/:interval/add', saveIntervalData);

module.exports = router;

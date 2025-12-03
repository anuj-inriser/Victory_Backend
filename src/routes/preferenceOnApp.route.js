const express = require('express');
const { getPreferenceOnApp, getByIdPreferenceOnApp } = require('../controllers/preferenceOnApp.controller');
const router = express.Router();

router.get('/', getPreferenceOnApp)

router.get('/:id', getByIdPreferenceOnApp)

module.exports = router
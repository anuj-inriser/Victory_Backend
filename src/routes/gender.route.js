const express = require('express');
const { getGenders, getByIdGenders } = require('../controllers/gender.controller');
const router = express.Router();

router.get('/', getGenders)

router.get('/:id', getByIdGenders)

module.exports = router
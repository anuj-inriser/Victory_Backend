const express = require('express');
const { getAllGrievanceMetas, createGrievanceMeta, updateGrievanceMeta, getByIdGrievanceMeta, deleteGrievanceMeta } = require('../controllers/grievanceMeta.controller');

const router = express.Router();

router.get('/', getAllGrievanceMetas);

router.post('/', createGrievanceMeta);

router.put('/:id', updateGrievanceMeta);

router.get('/:id', getByIdGrievanceMeta);

router.delete('/:id', deleteGrievanceMeta);

module.exports = router;

const express = require('express')
const router = express.Router();

const { getTradeRecommendations,getAllTradeRecommendations, createTradeRecommendations, updateTradeRecommendations, deleteTradeRecommendations, getByIdTradeRecommendations } = require('../controllers/tradeRecommendations.controller');

router.get('/', getTradeRecommendations);
router.get('/all', getAllTradeRecommendations)

router.post('/', createTradeRecommendations);

router.put('/:id', updateTradeRecommendations);

router.put('/:id', getByIdTradeRecommendations);

router.delete('/:id', deleteTradeRecommendations);

module.exports = router;
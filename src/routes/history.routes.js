const express =  require('express');
const { fetchHistory } = require('../controllers/history.controller.js');

const router = express.Router();

router.get('/history', fetchHistory);

module.exports = router;

const express = require('express');
const { getProPlanTransactionById, getAllProPlanTransactions, createProPlanTransaction, updateProPlanTransaction, deleteProPlanTransaction } = require('../controllers/proPlanTransactions.controller');
const router = express.Router();

router.get('/',getAllProPlanTransactions)

router.get('/:id',getProPlanTransactionById)

router.post('/',createProPlanTransaction)

router.put('/:id',updateProPlanTransaction)

router.delete('/:id',deleteProPlanTransaction)

module.exports = router;
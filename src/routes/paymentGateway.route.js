const express = require('express');
const { getAllPaymentGateway, getPaymentGatewayById, createPaymentGateway, updatePaymentGateway, deletePaymentGateway } = require('../controllers/paymentGateway.controller');
const router = express.Router();

router.get('/', getAllPaymentGateway)

router.get('/:id', getPaymentGatewayById)

router.post('/', createPaymentGateway)

router.put('/:id', updatePaymentGateway)

router.delete('/:id', deletePaymentGateway)

module.exports = router;
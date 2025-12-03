const express = require('express')
const { getAllUserKyc, createUserKyc, updateUserKyc, getUserKycById, deleteUserKyc } = require('../controllers/userKyc.controller')
const router = express.Router()

router.get('/', getAllUserKyc)

router.post('/',createUserKyc)

router.put('/:id',updateUserKyc)

router.get('/:id',getUserKycById)

router.delete('/:id',deleteUserKyc)


module.exports = router
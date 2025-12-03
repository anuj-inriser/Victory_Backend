const express = require('express')
const { getContactByContactId, getContactByUserId, createContact, updateContact, deleteContact } = require('../controllers/contactBook.controller')
const router = express.Router()

router.get('/contact/:contactid',getContactByContactId);

router.get('/user/:userid',getContactByUserId);

router.post('/',createContact);

router.put('/:contactid',updateContact);

router.delete('/:contactid',deleteContact);

module.exports = router
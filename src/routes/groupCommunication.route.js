const express = require("express");
const { getAllGroupCommunications, getGroupCommunicationById, createGroupCommunication, updateGroupCommunication, deleteGroupCommunication } = require("../controllers/groupCommunication.controller");
const router = express.Router();

router.get('/',getAllGroupCommunications)

router.get('/:id',getGroupCommunicationById)

router.post('/',createGroupCommunication)

router.put('/:id',updateGroupCommunication)

router.delete('/:id',deleteGroupCommunication)

module.exports = router;
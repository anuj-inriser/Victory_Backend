const express = require("express");
const {
   getAllPeerCommunications,
    createPeerCommunication,
    getPeerCommunicationsByUser,
    updatePeerCommunication,
    deletePeerCommunication
} = require("../controllers/peerCommunication.controller");

const router = express.Router();

router.get("/", getAllPeerCommunications);
router.post("/", createPeerCommunication);
router.get("/user/:userid", getPeerCommunicationsByUser);
router.put("/:id", updatePeerCommunication);
router.delete("/:id", deletePeerCommunication);

module.exports = router;
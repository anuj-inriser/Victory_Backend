const express = require("express");
const { getAllPins, getPinById, createPin, updatePin, deletePin } = require("../controllers/pin.controller");
const router = express.Router();

router.get('/',getAllPins)

router.get('/:id',getPinById)

router.post('/',createPin)

router.put('/:id',updatePin)

router.delete('/:id',deletePin)

module.exports = router;
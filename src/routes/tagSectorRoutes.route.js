const express = require("express");
const {
    getAllTagSectors,
} = require("../controllers/tagsector.controller.js");
const router = express.Router();

router.get("/", getAllTagSectors);



module.exports = router;

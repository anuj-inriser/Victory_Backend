const express = require("express");
const {
    getAllTagIndustries,
} = require("../controllers/tagindustry.controller.js");
const router = express.Router();

router.get("/", getAllTagIndustries);


module.exports = router;

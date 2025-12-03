const express = require("express");
const { getAllPrivacy, getPrivacyById, createPrivacy, updatePrivacy, deletePrivacy } = require("../controllers/privacy.controller");
const router = express.Router();

router.get("/", getAllPrivacy);

router.get("/:id", getPrivacyById);

router.post("/", createPrivacy);

router.put("/:id", updatePrivacy);

router.delete("/:id", deletePrivacy);

module.exports = router;
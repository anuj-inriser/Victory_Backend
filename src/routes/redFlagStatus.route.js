const express = require("express");
const {
  getAllRedFlagsStatus,
  getRedFlagStatusById,
} = require("../controllers/red_flags_status.controller");
const router = express.Router();

router.get("/", getAllRedFlagsStatus);

router.get("/:id", getRedFlagStatusById);

module.exports = router;

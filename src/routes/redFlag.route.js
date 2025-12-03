const express = require("express");
const router = express.Router();
const {
  createRedFlag,
  updateRedFlag,
  deleteRedFlag,
  getAllRedFlags,
  getRedFlagById,
} = require("../controllers/redFlag.controller.js");


router.get("/", getAllRedFlags);
router.get("/:id", getRedFlagById);
router.post("/", createRedFlag);
router.put("/:id", updateRedFlag);
router.delete("/:id", deleteRedFlag);

module.exports = router;

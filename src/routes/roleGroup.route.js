const express = require("express");
const {
  getAllRoleGroups,
  getRoleGroupById,
  createRoleGroup,
  updateRoleGroup,
  deleteRoleGroup,
} = require("../controllers/roleGroup.controller");
const router = express.Router();

router.get("/", getAllRoleGroups);

router.get("/:id", getRoleGroupById);

router.post("/", createRoleGroup);

router.put("/:id", updateRoleGroup);

router.delete("/:id", deleteRoleGroup);

module.exports = router;

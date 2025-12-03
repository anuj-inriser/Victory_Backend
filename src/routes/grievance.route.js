const express = require("express");
const {
  getAllGrievances,
  createGrievance,
  updateGrievance,
  deleteGrievance,
  getByIdGrievance,
  getByIdGrievanceMeta,
  getUniqueStatusOptions,
  getUniqueComplaintTypeOptions,
} = require("../controllers/grievance.controller");
const upload = require("../middleware/uploadFiles.middleware.js");
const router = express.Router();

router.get("/", getAllGrievances);
router.get("/status-options", getUniqueStatusOptions);
router.get("/complaint-types", getUniqueComplaintTypeOptions);

router.post(
  "/",
  upload.fields([
    { name: "agreement", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "grievancesAttachment", maxCount: 1 },
  ]),
  createGrievance
);

router.get("/:id", getByIdGrievance);
router.get("/grievancemeta/:id", getByIdGrievanceMeta);

router.put("/:id", upload.fields([
  { name: "agreement", maxCount: 1 },
  { name: "document", maxCount: 1 },
  { name: "grievancesAttachment", maxCount: 1 },
]), updateGrievance);

router.delete("/:id", deleteGrievance);

module.exports = router;

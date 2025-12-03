const express = require("express");
const {
    createGrievanceResponse,
    getGrievanceResponses,
    getGrievanceResponseById,
    updateGrievanceResponse,
    deleteGrievanceResponse
} = require("../controllers/grievanceResponse.controller");
const upload = require("../middleware/uploadFiles.middleware");

const router = express.Router();

router.post("/", upload.single("attachment"), createGrievanceResponse);
// router.get("/", getGrievanceResponses);
// router.get("/:id", getGrievanceResponseById);
// router.put("/:id", updateGrievanceResponse);
// router.delete("/:id", deleteGrievanceResponse);

module.exports = router;

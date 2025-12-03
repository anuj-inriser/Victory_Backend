const express = require("express");
const {
   getAllTexts,
    createText,
    getTextById,
    updateText,
    deleteText
} = require("../controllers/texts.controller");

const router = express.Router();

router.get("/", getAllTexts);
router.post("/", createText);
router.get("/text/:textid", getTextById);
router.put("/:id", updateText);
router.delete("/:id", deleteText);

module.exports = router;
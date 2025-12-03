const multer = require("multer");
const fs = require("fs");
const { getNextUserId } = require("../utils/maxUserID.utils.js");
const path = require("path");

// Utility to ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {

      if (file.fieldname === "moduleimage") {
        const moduleFolder = path.join(process.cwd(), `uploads/moduleimages`);
        ensureDir(moduleFolder);
        return cb(null, moduleFolder);
      }

      if (file.fieldname === "attachment") {
        const attachmentFolder = path.join(process.cwd(), `uploads/attachments`);
        ensureDir(attachmentFolder);
        return cb(null, attachmentFolder);
      }
      if (file.fieldname === "image_url") {
        const imageFolder = path.join(process.cwd(), `uploads/newsimages`);
        ensureDir(imageFolder);
        return cb(null, imageFolder);
      }

      // if (Array.isArray(req.body.userId)) {
      //   req.body.userId = req.body.userId[req.body.userId.length - 1];
      // }

      // if (!req.body.userId) {
      //   req.body.userId = await getNextUserId();
      // }
      // Ensure req.body is parsed for text fields
      // Multer automatically does this if form-data fields come before files
      const userId = req.body.userId || 0;

      // const userFolder = path.join(__dirname, `../../uploads/U${userId}`);
      const userFolder = path.join(process.cwd(), `uploads/U${userId}`);

      ensureDir(userFolder);

      // Subfolders
      const folderMap = {
        agreement: "agreements",
        document: "documents",
        grievancesAttachment: "grievancesAttachment",
        moduleimage: "moduleimages",
        attachment: "attachments",
        image_url: "newsimages",
      };

      const subFolder = folderMap[file.fieldname];
      if (!subFolder) return cb(new Error("Invalid field name"), null);

      const uploadPath = path.join(userFolder, subFolder);
      ensureDir(uploadPath);

      cb(null, uploadPath);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    const userId = req.body.userId;
    const agreementNo = req.body.agreementNo || "0";
    const documentNo = req.body.documentNo || "0";
    const grievanceNo = req.body.GrievanceNo || "0";
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);


    if (file.fieldname === "moduleimage") {
      const now = new Date();
      const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
      ].join("_");

      return cb(null, `${timestamp}_${baseName}${ext}`);
    }


    if (file.fieldname === "attachment") {
      return cb(null, `${baseName}${ext}`);
    }

    if (file.fieldname === "grievancesAttachment") {
      const now = new Date();
      const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
      ].join("_");

      return cb(null, `${timestamp}_${baseName}${ext}`);
    }


    if (file.fieldname === "image_url") {
      const now = new Date();
      const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
      ].join("_");

      return cb(null, `${timestamp}_${baseName}${ext}`);
    }

    let prefix = `D${documentNo}`; // default
    if (file.fieldname === "agreement") prefix = `A${agreementNo}`;
    // else if (file.fieldname === "grievancesAttachment")
    //   prefix = `G${grievanceNo}`;

    const filename = `U${userId}-${prefix}-${baseName}${ext}`;
    cb(null, filename);
  },
});

// Only accept these file fields
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;

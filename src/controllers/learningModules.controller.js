const getPool = require("../db/db.js");
const path = require("path");
const fs = require("fs");

const getAllLearningModules = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM learning_module_master");

    return res.status(200).json({
      status: true,
      message: "Fetched all Learning Modules successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllLearningModules:", error);
    next(error);
  }
};

const getLearningModuleById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        lmm.moduleid,
        lmm.module_name,
        lmm.module_brief,
        lmm.module_image,
        lmm.created_at,
        lmm.updated_at,
        lc.id,
        lc.name
      FROM learning_module_master lmm
      LEFT JOIN learning_category lc ON lmm.learning_category = lc.id
      WHERE moduleid = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Learning Module fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Learning Module not found",
      });
    }
  } catch (error) {
    console.error("Error in getLearningModuleById:", error);
    next(error);
  }
};

const getLearningModuleByCategory = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        lmm.moduleid,
        lmm.module_name,
        lmm.module_brief,
        lmm.module_image,
        lmm.created_at,
        lmm.updated_at,
        lc.id,
        lc.name
      FROM learning_module_master lmm
      LEFT JOIN learning_category lc ON lmm.learning_category = lc.id
      WHERE lmm.learning_category = $1
    `;

    const result = await pool.query(query, [id]);

    return res.status(200).json({
      status: true,
      message: result.rows.length > 0
        ? "Learning Modules fetched successfully"
        : "No modules found for this category",
      data: result.rows, 
    });
  } catch (error) {
    console.error("Error in getLearningModuleById:", error);
    next(error);
  }
};


const createLearningModule = async (req, res, next) => {
  const pool = getPool();

  try {
    const { modulename, modulebrief, learningcategory } = req.body;
    const moduleimage = req.file ? req.file.filename : null;

    if (!modulename || !modulebrief) {
      return res.status(400).json({
        status: false,
        message: "Module Name and Module Brief are required",
      });
    }

    const query = `
      INSERT INTO learning_module_master (module_name, module_brief, module_image, learning_category, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING moduleid;
    `;

    const values = [modulename, modulebrief, moduleimage, learningcategory];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: true,
      message: "Learning Module Created Successfully",
      id: result.rows[0].moduleid,
    });

  } catch (error) {
    console.error("Error in createLearningModule:", error);
    next(error);
  }
};

const updateLearningModule = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;
  const { modulename, modulebrief, learningcategory } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    // Fetch existing module to get old image filename
    const existing = await pool.query(
      "SELECT module_image FROM learning_module_master WHERE moduleid = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ status: false, message: "Module not found" });
    }

    const oldImage = existing.rows[0].module_image;

    // If new image uploaded, update it. Otherwise keep old one.
    const moduleImageToSave = newImage ? newImage : oldImage;

    // Update DB
    await pool.query(
      `UPDATE learning_module_master
       SET module_name = $1, module_brief = $2, module_image = $3, learning_category = $4, updated_at = NOW()
       WHERE moduleid = $5`,
      [modulename, modulebrief, moduleImageToSave, learningcategory, id]
    );

    // If new image uploaded, delete the old image from disk
    if (newImage && oldImage) {
      const oldImagePath = path.join(process.cwd(), "uploads", "moduleimages", oldImage);

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.log("Failed to delete old image:", err.message);
        } else {
          console.log("Old image deleted:", oldImage);
        }
      });
    }


    return res.status(200).json({
      status: true,
      message: "Module updated successfully",
      id,
    });

  } catch (error) {
    console.error("Error in updateLearningModule:", error);
    next(error);
  }
};

const deleteLearningModule = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    // ✅ 1. Get existing module to check + get image name
    const result = await pool.query(
      `SELECT module_image FROM learning_module_master WHERE moduleid = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Learning Module not found",
      });
    }

    const imageName = result.rows[0].module_image;

    // ✅ 2. Delete from database
    await pool.query(`DELETE FROM learning_module_master WHERE moduleid = $1`, [id]);

    // ✅ 3. Remove image file (if exists)
    if (imageName) {
      const imagePath = path.join(process.cwd(), "uploads/moduleimages", imageName);

      fs.unlink(imagePath, (err) => {
        if (err) console.log("⚠️ Image delete skipped:", err.message);
      });
    }

    return res.status(200).json({
      status: true,
      message: "Learning Module deleted successfully",
      id,
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        status: false,
        message: "Cannot delete: This module is linked to learning content.",
      });
    }
    console.error("Error in deleteLearningModule:", error);
    next(error);
  }
};

module.exports = {
  createLearningModule,
  updateLearningModule,
  deleteLearningModule,
  getAllLearningModules,
  getLearningModuleById,
  getLearningModuleByCategory
};

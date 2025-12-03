const getPool = require("../db/db.js");
const path = require("path");
const fs = require("fs");


const getAllLearningCategory = async (req, res, next) => {
    const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM learning_category");

    return res.status(200).json({
      status: true,
      message: "Fetched all Learning Category successfully",
      data: result.rows,
    });


  } catch (error) {
    console.error("Error in fetching category:", error);
    next(error);
  }
}


module.exports = {
  getAllLearningCategory
};
const getPool = require("../db/db.js");

const getAllContentTypes = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM content_types_get_all()");

    res.status(200).json({
      message: "Content types fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching content types:", error);
    next(error);
  }
};

module.exports = {
  getAllContentTypes,
};

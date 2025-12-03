const getPool = require("../db/db.js");

const getAllContentLinkages = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM content_linkages_get_all()");

    res.status(200).json({
      message: "Content linkages fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching content linkages:", error);
    next(error);
  }
};

module.exports = {
  getAllContentLinkages,
};

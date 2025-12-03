const getpool = require("../db/db");

const getAllTermTypes = async (req, res, next) => {
  const pool = getpool();
  try {
    const result = await pool.query("SELECT * FROM term_types_getall()");
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching term types:", error);
    next(error);
  }
};

module.exports = { getAllTermTypes };

const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getTimeLineContent = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT * FROM time_line_content_get_all()"
    );
    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "timeLineContent fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching TimeLineContent = ", error);
    next(error);
  }
};

const getByIdTimeLineContent = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);
    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    const result = await pool.query(
      "SELECT * FROM time_line_content_get_by_id($1)",
      [id]
    );

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "timeLineContent by id fethed successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching TimeLineContent by id = ", error);
    next(error);
  }
};

module.exports = { getTimeLineContent, getByIdTimeLineContent };

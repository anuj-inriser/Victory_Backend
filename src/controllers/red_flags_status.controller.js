const getPool = require("../db/db.js");

const getAllRedFlagsStatus = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM red_flag_status_getall()");

    return res.status(200).json({
      status: true,
      message: "Fetched all RedFlagsStatus records successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllRedFlagsStatus:", error);
    next(error);
  }
};

const getRedFlagStatusById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM red_flag_status_getbyid($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "RedFlagStatus record fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "RedFlagStatus record not found",
      });
    }
  } catch (error) {
    console.error("Error in getRedFlagStatusById:", error);
    next(error);
  }
};

module.exports = { getAllRedFlagsStatus, getRedFlagStatusById };

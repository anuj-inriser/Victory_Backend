const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getExitType = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM exit_type_getall()");

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ExitType fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ExitType = ", error);
    next(error);
  }
};

const getByIdExitType = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = parseInt(req.params);

    const result = await pool.query("SELECT * FROM exit_type_getbyid($1)", [
      id,
    ]);

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ExitType by id fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ExitType by id = ", error);
    next(error);
  }
};

module.exports = { getExitType, getByIdExitType };

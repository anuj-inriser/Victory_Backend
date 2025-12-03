const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getScriptType = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM script_type_getall()");

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ScriptType fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ScriptType = ", error);
    next(error);
  }
};

const getByIdScriptType = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = parseInt(req.params);

    const result = await pool.query("SELECT * FROM script_type_getbyid($1)", [
      id,
    ]);

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ScriptType by id fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ScriptType by id = ", error);
    next(error);
  }
};

module.exports = { getScriptType, getByIdScriptType };

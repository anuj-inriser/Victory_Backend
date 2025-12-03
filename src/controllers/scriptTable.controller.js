const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getScriptTable = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM script_table_getall()");

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ScriptTable fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ScriptTable = ", error);
    next(error);
  }
};

const getByIdScriptTable = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = parseInt(req.params);

    const result = await pool.query("SELECT * FROM script_table_getbyid($1)", [
      id,
    ]);

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "ScriptTable by id fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching ScriptTable by id = ", error);
    next(error);
  }
};

module.exports = { getScriptTable, getByIdScriptTable };

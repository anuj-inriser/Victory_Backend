const getPool = require("../db/db.js");

const getAllPlanTypes = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM plan_type_getall()");
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllPlanTypes:", error);
    next(error);
  }
};

module.exports = {
  getAllPlanTypes,
};

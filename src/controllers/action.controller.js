const getPool = require("../db/db.js");

const getAllActions = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM actions_get_all()"); // your PostgreSQL function name
    res.status(200).json({
      status: true,
      message: "Actions fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching actions:", error);
    next(error);
  }
};

const getActionById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM actions_get_by_id($1)", [
      id,
    ]);
    res.status(200).json({
      status: true,
      message: "Action fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching action by ID:", error);
    next(error);
  }
};

module.exports = {
  getAllActions,
  getActionById,
};

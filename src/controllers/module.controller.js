const getPool = require("../db/db.js");

const getAllModules = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM modules_get_all()"); // your PostgreSQL function name
    res.status(200).json({
      status: true,
      message: "Modules fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    next(error);
  }
};

const getModuleById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM modules_get_by_id($1)", [
      id,
    ]);
    res.status(200).json({
      status: true,
      message: "Module fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching module by ID:", error);
    next(error);
  }
};

module.exports = {
  getAllModules,
  getModuleById,
};

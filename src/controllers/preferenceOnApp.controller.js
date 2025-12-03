const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getPreferenceOnApp = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT * FROM preference_on_app_get_all()"
    );

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "preferenceOnApp fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching prefernceOnApp = ", error);
    next(error);
  }
};

const getByIdPreferenceOnApp = async (req, res, next) => {
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
      "SELECT * FROM preference_on_app_get_by_id($1)",
      [id]
    );

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "preferenceOnApp by id fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching preferenceOnApp by id = ", error);
    next(error);
  }
};

module.exports = { getPreferenceOnApp, getByIdPreferenceOnApp };

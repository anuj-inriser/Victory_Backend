const getPool = require("../db/db.js");

const getAllBenefitTypes = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM benefit_type_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all benefit types successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllBenefitTypes:", error);
    next(error);
  }
};

const getBenefitTypeById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM benefit_type_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched benefit type successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Benefit type not found",
      });
    }
  } catch (error) {
    console.error("Error in getBenefitTypeById:", error);
    next(error);
  }
};

module.exports = {
  getAllBenefitTypes,
  getBenefitTypeById,
};

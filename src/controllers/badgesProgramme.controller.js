const getPool = require("../db/db.js");

const getAllBadgesProgramme = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM badges_programme_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all badge programmes successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllBadgesProgramme:", error);
    next(error);
  }
};

const getBadgeProgrammeById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM badges_programme_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched badge programme successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Badge programme not found",
      });
    }
  } catch (error) {
    console.error("Error in getBadgeProgrammeById:", error);
    next(error);
  }
};

const createBadgeProgramme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL badges_programme_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        id: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in createBadgeProgramme:", error);
    next(error);
  }
};

const updateBadgeProgramme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, badge_id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL badges_programme_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in updateBadgeProgramme:", error);
    next(error);
  }
};

const deleteBadgeProgramme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { badge_id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL badges_programme_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in deleteBadgeProgramme:", error);
    next(error);
  }
};

module.exports = {
  getAllBadgesProgramme,
  getBadgeProgrammeById,
  createBadgeProgramme,
  updateBadgeProgramme,
  deleteBadgeProgramme,
};

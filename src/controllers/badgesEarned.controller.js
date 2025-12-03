const getPool = require("../db/db.js");

const getAllBadgesEarned = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM badge_earned_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all badges earned successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllBadgesEarned:", error);
    next(error);
  }
};

const getBadgeEarnedById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM badge_earned_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched badge earned successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Badge earned record not found",
      });
    }
  } catch (error) {
    console.error("Error in getBadgeEarnedById:", error);
    next(error);
  }
};

const createBadgeEarned = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL badge_earned_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(201).json({
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
    console.error("Error in createBadgeEarned:", error);
    next(error);
  }
};

const updateBadgeEarned = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL badge_earned_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateBadgeEarned:", error);
    next(error);
  }
};

const deleteBadgeEarned = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL badge_earned_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteBadgeEarned:", error);
    next(error);
  }
};

module.exports = {
  createBadgeEarned,
  updateBadgeEarned,
  deleteBadgeEarned,
  getAllBadgesEarned,
  getBadgeEarnedById,
};

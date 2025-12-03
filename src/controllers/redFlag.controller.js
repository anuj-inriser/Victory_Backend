const getPool = require("../db/db.js");

const getAllRedFlags = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM red_flags_getall()");

    return res.status(200).json({
      status: true,
      message: "Fetched all RedFlags records successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllRedFlags:", error);
    next(error);
  }
};

const getRedFlagById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM red_flags_getbyid($1)", [
      id,
    ]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "RedFlag record fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "RedFlag record not found",
      });
    }
  } catch (error) {
    console.error("Error in getRedFlagById:", error);
    next(error);
  }
};

const createRedFlag = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL red_flags_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

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
    console.error("Error in createRedFlag:", error);
    next(error);
  }
};

const updateRedFlag = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, redflag_id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL red_flags_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

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
    console.error("Error in updateRedFlag:", error);
    next(error);
  }
};

const deleteRedFlag = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { redflag_id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL red_flags_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

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
    console.error("Error in deleteRedFlag:", error);
    next(error);
  }
};

module.exports = {
  createRedFlag,
  updateRedFlag,
  deleteRedFlag,
  getAllRedFlags,
  getRedFlagById,
};

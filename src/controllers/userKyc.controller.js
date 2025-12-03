const getPool = require("../db/db.js");

const getAllUserKyc = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM user_kyc_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all KYC records successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllUserKyc:", error);
    next(error);
  }
};

const getUserKycById = async (req, res, next) => {
  const pool = getPool();
  let { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM user_kyc_get_by_id($1)", [
      id,
    ]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "KYC record fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "KYC record not found",
      });
    }
  } catch (error) {
    console.error("Error in getUserKycById:", error);
    next(error);
  }
};

const createUserKyc = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL user_kyc_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createUserKyc:", error);
    next(error);
  }
};

const updateUserKyc = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: req.params.id };

  try {
    const result = await pool.query(
      "CALL user_kyc_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateUserKyc:", error);
    next(error);
  }
};

const deleteUserKyc = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL user_kyc_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteUserKyc:", error);
    next(error);
  }
};

module.exports = {
  createUserKyc,
  updateUserKyc,
  deleteUserKyc,
  getAllUserKyc,
  getUserKycById,
};

const getPool = require("../db/db.js");

const getAllAffiliateBalances = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_balance_get_all()"
    );

    return res.status(200).json({
      status: true,
      message: "Fetched all affiliate balances successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllAffiliateBalances:", error);
    next(error);
  }
};

const getAffiliateBalanceById = async (req, res, next) => {
  const pool = getPool();
  const user_id = Number(req.params.user_id);

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_balance_get_by_id($1)",
      [user_id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched affiliate balance successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Affiliate balance not found",
      });
    }
  } catch (error) {
    console.error("Error in getAffiliateBalanceById:", error);
    next(error);
  }
};

const createAffiliateBalance = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL affiliate_balance_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(201).json({
        status: out_status,
        message: out_message,
        user_id: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in createAffiliateBalance:", error);
    next(error);
  }
};

const updateAffiliateBalance = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, user_id: Number(req.params.user_id) };

  try {
    const result = await pool.query(
      "CALL affiliate_balance_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        user_id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in updateAffiliateBalance:", error);
    next(error);
  }
};

const deleteAffiliateBalance = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { user_id: parseInt(req.params.user_id, 10) };

  try {
    const result = await pool.query(
      "CALL affiliate_balance_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        user_id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in deleteAffiliateBalance:", error);
    next(error);
  }
};

module.exports = {
  createAffiliateBalance,
  updateAffiliateBalance,
  deleteAffiliateBalance,
  getAllAffiliateBalances,
  getAffiliateBalanceById,
};
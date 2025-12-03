const getPool = require("../db/db.js");

const getAllAffiliateTransactions = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_transactions_get_all()"
    );

    return res.status(200).json({
      status: true,
      message: "Fetched all affiliate transactions successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllAffiliateTransactions:", error);
    next(error);
  }
};

const getAffiliateTransactionById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_transactions_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched affiliate transaction successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Affiliate transaction not found",
      });
    }
  } catch (error) {
    console.error("Error in getAffiliateTransactionById:", error);
    next(error);
  }
};

const createAffiliateTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL affiliate_transactions_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createAffiliateTransaction:", error);
    next(error);
  }
};

const updateAffiliateTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, transaction_id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL affiliate_transactions_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateAffiliateTransaction:", error);
    next(error);
  }
};

const deleteAffiliateTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { transaction_id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL affiliate_transactions_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteAffiliateTransaction:", error);
    next(error);
  }
};

module.exports = {
  createAffiliateTransaction,
  updateAffiliateTransaction,
  deleteAffiliateTransaction,
  getAllAffiliateTransactions,
  getAffiliateTransactionById,
};

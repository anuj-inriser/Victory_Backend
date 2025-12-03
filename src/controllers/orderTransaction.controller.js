const getPool = require("../db/db.js");

const getAllOrderTransactions = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      "SELECT * FROM transactions.orders_transactions_get_all()"
    );

    return res.status(200).json({
      status: true,
      message: "Fetched all order transactions successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllOrderTransactions:", error);
    next(error);
  }
};

const getOrderTransactionById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM transactions.orders_transactions_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Order transaction fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Order transaction not found",
      });
    }
  } catch (error) {
    console.error("Error in getOrderTransactionById:", error);
    next(error);
  }
};

const createOrderTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL order_transaction_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createOrderTransaction:", error);
    next(error);
  }
};

const updateOrderTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: req.params.id };

  try {
    const result = await pool.query(
      "CALL order_transaction_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateOrderTransaction:", error);
    next(error);
  }
};

const deleteOrderTransaction = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL order_transaction_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteOrderTransaction:", error);
    next(error);
  }
};

module.exports = {
  createOrderTransaction,
  updateOrderTransaction,
  deleteOrderTransaction,
  getAllOrderTransactions,
  getOrderTransactionById,
};

const getPool = require("../db/db.js");

const getAllPaymentGateway = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM payment_gateway_getall()");
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllPaymentGatewayTransactions:", error);
    next(error);
  }
};

const getPaymentGatewayById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Transaction ID is required",
        result: null,
      });
    }

    const result = await pool.query(
      "SELECT * FROM payment_gateway_getbyid($1)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getPaymentGatewayTransactionById:", error);
    next(error);
  }
};

const createPaymentGateway = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      service_provider,
      service_provider_tid,
      recurring_type,
      amount,
      transaction_date,
      transaction_time,
      transaction_type,
      transaction_status,
      error_code,
      commission_rate,
      commission_amount,
      net_amount,
      bank_settlement_date,
    } = req.body;

    const jsonData = {
      service_provider: service_provider || null,
      service_provider_tid: service_provider_tid || null,
      recurring_type: recurring_type || null,
      amount: amount || null,
      transaction_date: transaction_date || null,
      transaction_time: transaction_time || null,
      transaction_type: transaction_type || null,
      transaction_status: transaction_status || null,
      error_code: error_code || null,
      commission_rate: commission_rate || null,
      commission_amount: commission_amount || null,
      net_amount: net_amount || null,
      bank_settlement_date: bank_settlement_date || null,
    };

    const result = await pool.query(
      "CALL payment_gateway_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createPaymentGatewayTransaction:", error);
    next(error);
  }
};

const updatePaymentGateway = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const {
      service_provider,
      service_provider_tid,
      recurring_type,
      amount,
      transaction_date,
      transaction_time,
      transaction_type,
      transaction_status,
      error_code,
      commission_rate,
      commission_amount,
      net_amount,
      bank_settlement_date,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Transaction ID is required",
        result: 0,
      });
    }

    const jsonData = {
      transaction_id: Number(id),
      service_provider: service_provider || null,
      service_provider_tid: service_provider_tid || null,
      recurring_type: recurring_type || null,
      amount: amount || null,
      transaction_date: transaction_date || null,
      transaction_time: transaction_time || null,
      transaction_type: transaction_type || null,
      transaction_status: transaction_status || null,
      error_code: error_code || null,
      commission_rate: commission_rate || null,
      commission_amount: commission_amount || null,
      net_amount: net_amount || null,
      bank_settlement_date: bank_settlement_date || null,
    };

    const result = await pool.query(
      "CALL payment_gateway_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updatePaymentGatewayTransaction:", error);
    next(error);
  }
};

const deletePaymentGateway = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Transaction ID is required",
        result: 0,
      });
    }

    const result = await pool.query(
      "CALL payment_gateway_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deletePaymentGatewayTransaction:", error);
    next(error);
  }
};

module.exports = {
  getAllPaymentGateway,
  getPaymentGatewayById,
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
};

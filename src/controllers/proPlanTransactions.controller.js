const getPool = require("../db/db.js");

const getAllProPlanTransactions = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT * FROM pro_plans_transaction_getall()"
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllProPlanTransactions:", error);
    next(error);
  }
};

const getProPlanTransactionById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Pro plan transaction ID is required",
        result: null,
      });
    }

    const result = await pool.query(
      "SELECT * FROM pro_plans_transaction_getbyid($1)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getProPlanTransactionById:", error);
    next(error);
  }
};

const createProPlanTransaction = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      user_id,
      transaction_id,
      invoice_id,
      plan_name,
      plan_type_id,
      plan_activation_type_id,
      plan_activation_date,
      plan_deactivation_date,
      plan_status,
      plan_status_note,
    } = req.body;

    // if (!user_id) {
    //     return res.status(400).json({
    //         status: false,
    //         message: 'user_id is required',
    //         result: 0
    //     });
    // }

    // if (!plan_name || plan_name.trim() === '') {
    //     return res.status(400).json({
    //         status: false,
    //         message: 'plan_name is required',
    //         result: 0
    //     });
    // }

    // if (!plan_type_id) {
    //     return res.status(400).json({
    //         status: false,
    //         message: 'plan_type_id is required',
    //         result: 0
    //     });
    // }

    // if (!plan_activation_type_id) {
    //     return res.status(400).json({
    //         status: false,
    //         message: 'plan_activation_type_id is required',
    //         result: 0
    //     });
    // }

    const jsonData = {
      user_id: Number(user_id),
      transaction_id: transaction_id || null,
      invoice_id: invoice_id || null,
      plan_name,
      plan_type_id: Number(plan_type_id),
      plan_activation_type_id: Number(plan_activation_type_id),
      plan_activation_date: plan_activation_date || null,
      plan_deactivation_date: plan_deactivation_date || null,
      plan_status: plan_status || null,
      plan_status_note: plan_status_note || null,
    };

    const result = await pool.query(
      "CALL pro_plans_transaction_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createProPlanTransaction:", error);
    next(error);
  }
};

const updateProPlanTransaction = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const {
      user_id,
      transaction_id,
      invoice_id,
      plan_name,
      plan_type_id,
      plan_activation_type_id,
      plan_activation_date,
      plan_deactivation_date,
      plan_status,
      plan_status_note,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Pro plan transaction ID is required",
        result: 0,
      });
    }

    const jsonData = {
      pro_plans_transaction_id: Number(id),
      user_id: user_id ? Number(user_id) : null,
      transaction_id: transaction_id || null,
      invoice_id: invoice_id || null,
      plan_name: plan_name || null,
      plan_type_id: plan_type_id ? Number(plan_type_id) : null,
      plan_activation_type_id: plan_activation_type_id
        ? Number(plan_activation_type_id)
        : null,
      plan_activation_date: plan_activation_date || null,
      plan_deactivation_date: plan_deactivation_date || null,
      plan_status: plan_status || null,
      plan_status_note: plan_status_note || null,
    };

    const result = await pool.query(
      "CALL pro_plans_transaction_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateProPlanTransaction:", error);
    next(error);
  }
};

const deleteProPlanTransaction = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Pro plan transaction ID is required",
        result: 0,
      });
    }

    const result = await pool.query(
      "CALL pro_plans_transaction_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteProPlanTransaction:", error);
    next(error);
  }
};

module.exports = {
  getAllProPlanTransactions,
  getProPlanTransactionById,
  createProPlanTransaction,
  updateProPlanTransaction,
  deleteProPlanTransaction,
};

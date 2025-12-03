const getPool = require("../db/db.js");

const getAllInvoices = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM invoice_getall()");
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllInvoices:", error);
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Invoice ID is required",
        result: null,
      });
    }

    const result = await pool.query("SELECT * FROM invoice_getbyid($1)", [
      Number(id),
    ]);
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getInvoiceById:", error);
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      user_id,
      user_address,
      user_gst_number,
      hsn_code,
      plan_name,
      plan_validity,
      invoice_amount,
      discount_code,
      discount_amount,
      invoice_amount_net,
      cgst_rate,
      cgst,
      sgst_rate,
      sgst,
      igst_rate,
      igst,
      total_invoice_amount,
      payment_method,
      service_provider_tid,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: false,
        message: "user_id is required",
        result: 0,
      });
    }

    const jsonData = {
      user_id: Number(user_id),
      user_address: user_address || null,
      user_gst_number: user_gst_number || null,
      hsn_code: hsn_code || null,
      plan_name: plan_name || null,
      plan_validity: plan_validity || null,
      invoice_amount: invoice_amount || null,
      discount_code: discount_code || null,
      discount_amount: discount_amount || null,
      invoice_amount_net: invoice_amount_net || null,
      cgst_rate: cgst_rate || null,
      cgst: cgst || null,
      sgst_rate: sgst_rate || null,
      sgst: sgst || null,
      igst_rate: igst_rate || null,
      igst: igst || null,
      total_invoice_amount: total_invoice_amount || null,
      payment_method: payment_method || null,
      service_provider_tid: service_provider_tid || null,
    };

    const result = await pool.query(
      "CALL invoice_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createInvoice:", error);
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const {
      user_id,
      user_address,
      user_gst_number,
      hsn_code,
      plan_name,
      plan_validity,
      invoice_amount,
      discount_code,
      discount_amount,
      invoice_amount_net,
      cgst_rate,
      cgst,
      sgst_rate,
      sgst,
      igst_rate,
      igst,
      total_invoice_amount,
      payment_method,
      service_provider_tid,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Invoice ID is required",
        result: 0,
      });
    }

    const jsonData = {
      invoice_id: Number(id),
      user_id: user_id ? Number(user_id) : null,
      user_address: user_address || null,
      user_gst_number: user_gst_number || null,
      hsn_code: hsn_code || null,
      plan_name: plan_name || null,
      plan_validity: plan_validity || null,
      invoice_amount: invoice_amount || null,
      discount_code: discount_code || null,
      discount_amount: discount_amount || null,
      invoice_amount_net: invoice_amount_net || null,
      cgst_rate: cgst_rate || null,
      cgst: cgst || null,
      sgst_rate: sgst_rate || null,
      sgst: sgst || null,
      igst_rate: igst_rate || null,
      igst: igst || null,
      total_invoice_amount: total_invoice_amount || null,
      payment_method: payment_method || null,
      service_provider_tid: service_provider_tid || null,
    };

    const result = await pool.query(
      "CALL invoice_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Invoice ID is required",
        result: 0,
      });
    }

    const result = await pool.query(
      "CALL invoice_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteInvoice:", error);
    next(error);
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};

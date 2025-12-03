const getPool = require("../db/db.js");

const getAllScripts = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM script_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all Script records successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllScripts:", error);
    next(error);
  }
};

const getScriptById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM script_get_by_id($1)", [id]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Script record fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Script record not found",
      });
    }
  } catch (error) {
    console.error("Error in getScriptById:", error);
    next(error);
  }
};

const createScript = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL script_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

    if (out_status) {
      return res.status(201).json({
        status: out_status,
        message: out_message,
        script_id: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in createScript:", error);
    next(error);
  }
};

const updateScript = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, script_id: req.params.id };

  try {
    const result = await pool.query(
      "CALL script_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        script_id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in updateScript:", error);
    next(error);
  }
};

const deleteScript = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { script_id: req.params.id };

  try {
    const result = await pool.query(
      "CALL script_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows?.[0] || {};

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        script_id: out_result,
      });
    } else {
      return res.status(404).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.error("Error in deleteScript:", error);
    next(error);
  }
};

module.exports = {
  createScript,
  updateScript,
  deleteScript,
  getAllScripts,
  getScriptById,
};

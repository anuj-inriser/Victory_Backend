const getPool = require("../db/db.js");

const getAllRoleGroups = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM role_group_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all role groups successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllRoleGroups:", error);
    next(error);
  }
};

const getRoleGroupById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM role_group_get_by_id($1)", [
      id,
    ]);

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Role group fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Role group not found",
      });
    }
  } catch (error) {
    console.error("Error in getRoleGroupById:", error);
    next(error);
  }
};

const createRoleGroup = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL role_group_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createRoleGroup:", error);
    next(error);
  }
};

const updateRoleGroup = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: req.params.id };

  try {
    const result = await pool.query(
      "CALL role_group_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateRoleGroup:", error);
    next(error);
  }
};

const deleteRoleGroup = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL role_group_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteRoleGroup:", error);
    next(error);
  }
};

module.exports = {
  getAllRoleGroups,
  getRoleGroupById,
  createRoleGroup,
  updateRoleGroup,
  deleteRoleGroup,
};
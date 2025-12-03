const getPool = require("../db/db.js");

const getAllGroupCommunications = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT * FROM group_communication_getall()"
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllGroupCommunications:", error);
    next(error);
  }
};

const getGroupCommunicationById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM group_communication_getbyid($1)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getGroupCommunicationById:", error);
    next(error);
  }
};

const createGroupCommunication = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      group_name,
      group_description,
      group_authors,
      super_admins,
      monitor_admin,
      broadcast_admins,
      participants,
      sender,
      content_type,
      text,
      sent_time,
      edit_time,
      delivered_participants,
      read_participants,
      deleted_by,
      delete_time,
    } = req.body;

    const jsonData = req.body;

    const result = await pool.query(
      "CALL group_communication_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createGroupCommunication:", error);
    next(error);
  }
};

const updateGroupCommunication = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const {
      group_name,
      group_description,
      group_authors,
      super_admins,
      monitor_admin,
      broadcast_admins,
      participants,
      sender,
      content_type,
      text,
      sent_time,
      edit_time,
      delivered_participants,
      read_participants,
      deleted_by,
      delete_time,
    } = req.body;

    const jsonData = { group_id: Number(id), ...req.body };

    const result = await pool.query(
      "CALL group_communication_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateGroupCommunication:", error);
    next(error);
  }
};

const deleteGroupCommunication = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    const result = await pool.query(
      "CALL group_communication_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteGroupCommunication:", error);
    next(error);
  }
};

module.exports = {
  getAllGroupCommunications,
  getGroupCommunicationById,
  createGroupCommunication,
  updateGroupCommunication,
  deleteGroupCommunication,
};

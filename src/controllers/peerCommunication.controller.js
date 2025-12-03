const getPool = require("../db/db.js");

const getAllPeerCommunication = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      "SELECT * FROM peer_communication_get_all()"
    );

    return res.status(200).json({
      status: true,
      message: "Fetched all peer communications successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllPeerCommunication:", error);
    next(error);
  }
};

const getPeerCommunicationById = async (req, res, next) => {
  const pool = getPool();
  let { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM peer_communication_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Peer communication record fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Peer communication record not found",
      });
    }
  } catch (error) {
    console.error("Error in getPeerCommunicationById:", error);
    next(error);
  }
};

const createPeerCommunication = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL peer_communication_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createPeerCommunication:", error);
    next(error);
  }
};

const updatePeerCommunication = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, chat_id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL peer_communication_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updatePeerCommunication:", error);
    next(error);
  }
};

const deletePeerCommunication = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { chat_id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL peer_communication_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deletePeerCommunication:", error);
    next(error);
  }
};

module.exports = {
  getAllPeerCommunication,
  getPeerCommunicationById,
  createPeerCommunication,
  updatePeerCommunication,
  deletePeerCommunication,
};

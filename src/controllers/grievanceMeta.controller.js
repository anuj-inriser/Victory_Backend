const path = require("path");
const getPool = require("../db/db.js");
const fs = require("fs");

const getAllGrievanceMetas = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM grievance_meta_get_all()");

    res.status(200).json({
      message: "Grievance metas fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching grievance metas =", error);
    next(error);
  }
};

const createGrievanceMeta = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      complaintid,
      userid,
      responsedate,
      responsetime,
      responsetext,
      respondedby,
      closeddate,
      complaintstatus,
      closedtime,
      clousuretext,
      closedby,
      communicationtrackid,
    } = req.body;


    const jsonData = {
      complaintid: Number(complaintid),
      userid: Number(userid),
      responsedate: responsedate || null,
      responsetime: responsetime || null,
      responsetext,
      respondedby,
      closeddate: closeddate || null,
      complaintstatus,
      closedtime: closedtime || null,
      clousuretext,
      closedby,
      communicationtrackid,
    };


    const dbResult = await pool.query("CALL grievance_meta_create($1)", [
      JSON.stringify(jsonData),
    ]);
    const { out_message, out_status, out_result } = dbResult.rows[0];


    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    }
  } catch (error) {
    console.error("Error in creating grievance meta:", error);
    next(error);
  }
};

const updateGrievanceMeta = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const {
      userid,
      responsedate,
      responsetime,
      responsetext,
      respondedby,
      closeddate,
      complaintstatus,
      closedtime,
      clousuretext,
      closedby,
      communicationtrackid,
    } = req.body;


    const jsonData = {
      complaintid: Number(id),
      userid: userid ? Number(userid) : null,
      responsedate,
      responsetime,
      responsetext,
      respondedby,
      closeddate,
      complaintstatus,
      closedtime,
      clousuretext,
      closedby,
      communicationtrackid,
    };


    const result = await pool.query("CALL grievance_meta_update($1)", [
      JSON.stringify(jsonData),
    ]);

    const { out_message, out_status, out_result } = result.rows[0];


    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    }
  } catch (error) {
    console.log("Error in updating grievance meta =", error);
    next(error);
  }
};

const getByIdGrievanceMeta = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const result = await pool.query(
      "SELECT * FROM grievance_meta_get_by_id($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grievance meta not found" });
    }

    res.status(200).json({
      message: "Grievance meta by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching grievance meta by ID =", error);
    next(error);
  }
};

const deleteGrievanceMeta = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const result = await pool.query("CALL grievance_meta_delete($1)", [id]);

    const { out_message, out_status, out_result } = result.rows[0];

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    }
  } catch (error) {
    console.log("Error in deleting grievance meta =", error);
    next(error);
  }
};

module.exports = {
  getAllGrievanceMetas,
  createGrievanceMeta,
  updateGrievanceMeta,
  getByIdGrievanceMeta,
  deleteGrievanceMeta,
};

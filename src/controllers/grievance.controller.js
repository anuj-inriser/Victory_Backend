const path = require("path");
const getPool = require("../db/db.js");
const fs = require("fs");

const getAllGrievances = async (req, res, next) => {
  const pool = getPool();
  try {
    let {
      page = 1,
      limit = 20,
      status = "",
      complaint_type = "",
      from = "",
      to = "",
      search = ""
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;


    let conditions = [];
    let values = [];
    let index = 1;

    if (status) {
      conditions.push(`g.complaint_status ILIKE $${index++}`);
      values.push(status);
    }

    if (complaint_type) {
      conditions.push(`g.complaint_type ILIKE $${index++}`);
      values.push(complaint_type);
    }

    if (from) {
      conditions.push(`g.submitted_date >= $${index++}`);
      values.push(from);
    }

    if (to) {
      conditions.push(`g.submitted_date <= $${index++}`);
      values.push(to);
    }

    if (search) {
      conditions.push(`
        (
          CAST(u.userid AS TEXT) ILIKE $${index} OR
          u.name ILIKE $${index} OR
          u.phone ILIKE $${index} OR
          u.email ILIKE $${index}
        )
      `);
      values.push(`%${search}%`);
      index++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // --------------------------------------
    // MAIN QUERY WITH PAGINATION
    // --------------------------------------
    const dataQuery = `
      SELECT 
        g.*,
        u.userid,
        u.name,
        u.email,
        u.phone
      FROM grievances g
      LEFT JOIN users u ON g.user_id = u.userid
      ${whereClause}
      ORDER BY g.submitted_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM grievances g
      LEFT JOIN users u ON g.user_id = u.userid
      ${whereClause}
    `;


    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, values),
      pool.query(countQuery, values)
    ]);

    const totalCount = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    // --------------------------------------
    // RESPONSE
    // --------------------------------------
    res.status(200).json({
      message: "Grievances fetched successfully",
      page,
      totalPages,
      totalCount,
      data: dataResult.rows
    });

  } catch (error) {
    console.error("Error in fetching grievances =", error);
    next(error);
  }
};

const getUniqueStatusOptions = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT DISTINCT complaint_status FROM grievances ORDER BY complaint_status"
    );

    res.status(200).json({
      message: "Unique status options fetched successfully",
      data: result.rows.map(row => row.complaint_status)
    });
  } catch (error) {
    console.error("Error in fetching unique status options =", error);
    next(error);
  }
};

const getUniqueComplaintTypeOptions = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT DISTINCT complaint_type FROM grievances ORDER BY complaint_type"
    );
    res.status(200).json({
      message: "Unique complaint type options fetched successfully",
      data: result.rows.map(row => row.complaint_type)
    });
  } catch (error) {
    console.error("Error in fetching unique complaint type options =", error);
    next(error);
  }
};

const createGrievance = async (req, res, next) => {
  const pool = getPool();

  try {
    // Ensure body values exist
    const {
      userId,
      complaint_type,
      subject,
      complaint_status,
      message_text,
      submitted_date,
      submitted_time,
      issue_type
    } = req.body;


    const grievanceFiles = req.files?.grievancesAttachment || [];

    // Get next complaint ID from DB
    const result = await pool.query(
      "SELECT COALESCE(MAX(complaint_id), 0) + 1 AS nextid FROM grievances"
    );
    const nextId = result.rows[0].nextid;
    const formattedComplaintId = `C${String(nextId).padStart(4, "0")}`;

    // Process attachments (if any)
    const attachments = grievanceFiles.map((file) => ({
      filename: file.filename, // ✅ saved filename
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `uploads/${file.path.replace(/\\/g, "/")}`, // normalize slashes
    }));

    // Prepare JSON for DB
    const jsonData = {
      userid: Number(userId) || 0,
      issue_type,
      complainttype: complaint_type?.trim() || "",
      subject: subject?.trim() || "",
      complaintstatus: complaint_status?.trim() || "Opened",
      messagetext: message_text?.trim() || "",
      submitteddate: submitted_date || new Date().toISOString().split("T")[0],
      submittedtime: submitted_time || new Date().toTimeString().split(" ")[0],
      attachments, // ✅ optional array (like documents/agreements)
    };



    // Call your grievance_create stored procedure
    const dbResult = await pool.query("CALL grievance_create($1)", [
      JSON.stringify(jsonData),
    ]);

    const { out_message, out_status, out_result } = dbResult.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
      complaintId: formattedComplaintId,
      attachmentsUploaded: attachments.length,
    });
  } catch (error) {
    console.error("Error in createGrievance:", error);
    next(error);
  }
};

const updateGrievance = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const {
      userid,
      complaint_type,
      subject,
      complaint_status,
      message_text,
      submitted_date,
      submitted_time,
      issue_type,
      attachment
    } = req.body;

    const jsonData = {
      complaintid: Number(id),
      userid: userid ? Number(userid) : null,
      complaint_type,
      subject,
      complaint_status,
      message_text,
      submitted_date,
      submitted_time,
      issue_type,
      attachment
    };


    const result = await pool.query("CALL grievance_update($1)", [
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
    console.log("Error in updating grievance =", error);
    next(error);
  }
};

const getByIdGrievance = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const result = await pool.query("SELECT * FROM grievances_get_by_id($1)", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.status(200).json({
      message: "Grievance by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching grievance by ID =", error);
    next(error);
  }
};

const getByIdGrievanceMeta = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const result = await pool.query("SELECT * FROM grievance_meta WHERE complaint_id = $1 ORDER BY \"response_time\" DESC", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grievance meta not found" });
    }

    res.status(200).json({
      message: "Grievance meta fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching grievance by ID =", error);
    next(error);
  }
};

const deleteGrievance = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    const result = await pool.query("CALL grievance_delete($1)", [id]);

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
    console.log("Error in deleting grievance =", error);
    next(error);
  }
};

module.exports = {
  getAllGrievances,
  createGrievance,
  updateGrievance,
  getByIdGrievance,
  deleteGrievance,
  getByIdGrievanceMeta,
  getUniqueStatusOptions,
  getUniqueComplaintTypeOptions,
};

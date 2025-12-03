const getPool = require("../db/db.js");


const createGrievanceResponse = async (req, res, next) => {
    const pool = getPool();
    const { userId, complaintstatus, response, closuretext, responseDate, responseTime, closedDate, closedTime, respondedBy, closedBy, complaintId } = req.body;

    const attachmentFile = req.file ? req.file.filename : null;
    try {
        const result = await pool.query(
            "INSERT INTO grievance_meta (user_id , complaint_id, response_date, response_time, responded_by,response_text, closed_date, complaint_status, closed_time, clousure_text, closed_by, attachment) VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9, $10, $11, $12)",
            [userId, complaintId, responseDate, responseTime, respondedBy, response, closedDate, complaintstatus, closedTime, closuretext, closedBy, attachmentFile]
        );
        res.status(201).json({ id: result.rows[0], ...req.body });
    } catch (error) { 
        next(error);
    }
};

module.exports = {
    createGrievanceResponse,
};
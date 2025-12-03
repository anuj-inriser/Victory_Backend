const getPool = require("../db/db.js");

const getAllComments = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM comments_get_all()");
    return res.status(200).json({
      status: true,
      message: "Fetched all comments successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllComments:", error);
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM comments_get_by_id($1)", [
      id,
    ]);
    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Comment fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.error("Error in getCommentById:", error);
    next(error);
  }
};

const createComment = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL comments_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createComment:", error);
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: req.params.id };

  try {
    const result = await pool.query(
      "CALL comments_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateComment:", error);
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL comments_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    next(error);
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};

const getPool = require("../db/db.js");

const getAllLikesDislikes = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM likes_dislikes_get_all()");

    res.status(200).json({
      message: "Likes/Dislikes fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching likes/dislikes:", error);
    next(error);
  }
};

const getLikesDislikesById = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    const result = await pool.query(
      "SELECT * FROM likes_dislikes_get_by_id($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Like/Dislike record not found" });
    }

    res.status(200).json({
      message: "Like/Dislike by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching like/dislike by ID:", error);
    next(error);
  }
};

const createLikesDislikes = async (req, res, next) => {
  const pool = getPool();

  try {
    const { ContentID, ReactionUserID, Like_Dislike, Date, Time } = req.body;

    const jsonData = req.body;

    const result = await pool.query(
      "CALL likes_dislikes_create($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createLikesDislikes:", error);
    next(error);
  }
};

const updateLikesDislikes = async (req, res, next) => {
  const pool = getPool();

  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }


    const jsonData = { ...req.body, id };

    const result = await pool.query(
      "CALL likes_dislikes_update($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );

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
    console.error("Error in updating like/dislike:", error);
    next(error);
  }
};

const deleteLikesDislikes = async (req, res, next) => {
  const pool = getPool();

  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    // ✅ CORRECT: Pass JSON object with id property
    const jsonData = { id: id };


    const result = await pool.query(
      "CALL likes_dislikes_delete($1,null,null,null)",
      [
        JSON.stringify(jsonData), // Pass as JSON string
      ]
    );

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
    console.error("Error in deleting like/dislike:", error);
    next(error);
  }
};

module.exports = {
  getAllLikesDislikes,
  getLikesDislikesById,
  createLikesDislikes,
  updateLikesDislikes,
  deleteLikesDislikes,
};

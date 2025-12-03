const getPool = require("../db/db.js");

const getAllCommunityPosts = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM community_posts_get_all()");

    res.status(200).json({
      message: "Community posts fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching community posts:", error);
    next(error);
  }
};

const getCommunityPostById = async (req, res, next) => {
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
      "SELECT * FROM community_posts_get_by_id($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Community post not found" });
    }

    res.status(200).json({
      message: "Community post by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching community post by ID:", error);
    next(error);
  }
};

const createCommunityPost = async (req, res, next) => {
  const pool = getPool();

  try {
    const jsonData = req.body;


    const result = await pool.query(
      "CALL community_posts_create($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createCommunityPost:", error);
    next(error);
  }
};

const updateCommunityPost = async (req, res, next) => {
  const pool = getPool();

  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    const jsonData = {
      content_id: id,
      ...req.body,
    };


    const result = await pool.query(
      "CALL community_posts_update($1,null,null,null)",
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
    console.error("Error in updating community post:", error);
    next(error);
  }
};

const deleteCommunityPost = async (req, res, next) => {
  const pool = getPool();

  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    const jsonData = { content_id: id };

    const result = await pool.query(
      "CALL community_posts_delete($1,null,null,null)",
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
    console.error("Error in deleting community post:", error);
    next(error);
  }
};

module.exports = {
  getAllCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
};

const getPool = require("../db/db.js");

const getAllContentPinnedSavedForLater = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query(
      "SELECT * FROM content_pinned_saved_for_later_get_all()"
    );

    res.status(200).json({
      message: "Content pinned/saved for later fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching content pinned/saved for later:", error);
    next(error);
  }
};

const getContentPinnedSavedForLaterById = async (req, res, next) => {
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
      "SELECT * FROM content_pinned_saved_for_later_get_by_id($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Content pinned/saved for later record not found" });
    }

    res.status(200).json({
      message: "Content pinned/saved for later by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error fetching content pinned/saved for later by ID:",
      error
    );
    next(error);
  }
};

const createContentPinnedSavedForLater = async (req, res, next) => {
  const pool = getPool();

  try {
    const jsonData = req.body;


    const result = await pool.query(
      "CALL content_pinned_saved_for_later_create($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createContentPinnedSavedForLater:", error);
    next(error);
  }
};

const updateContentPinnedSavedForLater = async (req, res, next) => {
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
      id: Number(id),
      ...req.body,
    };


    const result = await pool.query(
      "CALL content_pinned_saved_for_later_update($1,null,null,null)",
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
    console.error("Error in updating content pinned/saved for later:", error);
    next(error);
  }
};

const deleteContentPinnedSavedForLater = async (req, res, next) => {
  const pool = getPool();

  try {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id) || !id) {
      return res
        .status(400)
        .json({ message: "Invalid or Suspicious input in Id" });
    }

    const jsonData = { id: id };

  

    const result = await pool.query(
      "CALL content_pinned_saved_for_later_delete($1,null,null,null)",
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
    console.error("Error in deleting content pinned/saved for later:", error);
    next(error);
  }
};

module.exports = {
  getAllContentPinnedSavedForLater,
  getContentPinnedSavedForLaterById,
  createContentPinnedSavedForLater,
  updateContentPinnedSavedForLater,
  deleteContentPinnedSavedForLater,
};

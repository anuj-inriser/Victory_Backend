const getPool = require("../db/db.js");

const getAllContentPolls = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM content_polls_get_all()");

    res.status(200).json({
      message: "Content polls fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching content polls:", error);
    next(error);
  }
};

const getContentPollsById = async (req, res, next) => {
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
      "SELECT * FROM content_polls_get_by_id($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Content poll record not found" });
    }

    res.status(200).json({
      message: "Content poll by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching content poll by ID:", error);
    next(error);
  }
};

const createContentPolls = async (req, res, next) => {
  const pool = getPool();

  try {
    const jsonData = req.body;


    const result = await pool.query(
      "CALL content_polls_create($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createContentPolls:", error);
    next(error);
  }
};

const updateContentPolls = async (req, res, next) => {
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
      "CALL content_polls_update($1,null,null,null)",
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
    console.error("Error in updating content poll:", error);
    next(error);
  }
};

const deleteContentPolls = async (req, res, next) => {
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
      "CALL content_polls_delete($1,null,null,null)",
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
    console.error("Error in deleting content poll:", error);
    next(error);
  }
};

module.exports = {
  getAllContentPolls,
  getContentPollsById,
  createContentPolls,
  updateContentPolls,
  deleteContentPolls,
};

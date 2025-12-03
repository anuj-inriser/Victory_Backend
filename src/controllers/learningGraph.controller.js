const getPool = require("../db/db.js");

const getAllLearningGraph = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM learning_graph_getall()");
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllLearningGraphs:", error);
    next(error);
  }
};

const getLearningGraphById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM learning_graph_getbyid($1)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getLearningGraphById:", error);
    next(error);
  }
};

const createLearningGraph = async (req, res, next) => {
  const pool = getPool();
  try {
    const { user_id, module_id, chapter_id, status_id } = req.body;

    const jsonData = {
      user_id: Number(user_id),
      module_id: Number(module_id),
      chapter_id: Number(chapter_id),
      status_id: Number(status_id),
    };

    const result = await pool.query(
      "CALL learning_graph_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createLearningGraph:", error);
    next(error);
  }
};

const updateLearningGraph = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const { user_id, module_id, chapter_id, status_id } = req.body;

    const jsonData = {
      learning_graph_id: Number(id),
      user_id: user_id ? Number(user_id) : null,
      module_id: module_id ? Number(module_id) : null,
      chapter_id: chapter_id ? Number(chapter_id) : null,
      status_id: status_id ? Number(status_id) : null,
    };

    const result = await pool.query(
      "CALL learning_graph_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateLearningGraph:", error);
    next(error);
  }
};

const deleteLearningGraph = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    const result = await pool.query(
      "CALL learning_graph_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteLearningGraph:", error);
    next(error);
  }
};

module.exports = {
  getAllLearningGraph,
  getLearningGraphById,
  createLearningGraph,
  updateLearningGraph,
  deleteLearningGraph,
};

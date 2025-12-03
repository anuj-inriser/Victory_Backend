const getPool = require("../db/db.js");

const getAllAffiliateSchemes = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_schemes_get_all()"
    );

    return res.status(200).json({
      status: true,
      message: "Fetched all affiliate schemes successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllAffiliateSchemes:", error);
    next(error);
  }
};

const getAffiliateSchemeById = async (req, res, next) => {
  const pool = getPool();
  id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM affiliate_schemes_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched affiliate scheme successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Affiliate scheme not found",
      });
    }
  } catch (error) {
    console.error("Error in getAffiliateSchemeById:", error);
    next(error);
  }
};

const createAffiliateScheme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL affiliate_schemes_create($1, NULL, NULL, NULL)",
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
    console.error("Error in createAffiliateScheme:", error);
    next(error);
  }
};

const updateAffiliateScheme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, scheme_id: Number(req.params.id) };

  try {
    const result = await pool.query(
      "CALL affiliate_schemes_update($1, NULL, NULL, NULL)",
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
    console.error("Error in updateAffiliateScheme:", error);
    next(error);
  }
};

const deleteAffiliateScheme = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { scheme_id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL affiliate_schemes_delete($1, NULL, NULL, NULL)",
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
    console.error("Error in deleteAffiliateScheme:", error);
    next(error);
  }
};

module.exports = {
  createAffiliateScheme,
  updateAffiliateScheme,
  deleteAffiliateScheme,
  getAllAffiliateSchemes,
  getAffiliateSchemeById,
};

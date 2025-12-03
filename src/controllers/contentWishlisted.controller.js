const getPool = require("../db/db.js");

const getAllContentWishlist = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM content_wishlist_get_all()");
    return res.status(200).json({
      status: true,
      message: "Fetched all wishlist items successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllContentWishlist:", error);
    next(error);
  }
};

const getContentWishlistById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM content_wishlist_get_by_id($1)",
      [id]
    );
    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Wishlist item fetched successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Wishlist item not found",
      });
    }
  } catch (error) {
    console.error("Error in getContentWishlistById:", error);
    next(error);
  }
};

const createContentWishlist = async (req, res, next) => {
  const pool = getPool();
  const jsonData = req.body;

  try {
    const result = await pool.query(
      "CALL content_wishlist_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createContentWishlist:", error);
    next(error);
  }
};

const updateContentWishlist = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { ...req.body, id: req.params.id };

  try {
    const result = await pool.query(
      "CALL content_wishlist_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateContentWishlist:", error);
    next(error);
  }
};

const deleteContentWishlist = async (req, res, next) => {
  const pool = getPool();
  const jsonData = { id: parseInt(req.params.id, 10) };

  try {
    const result = await pool.query(
      "CALL content_wishlist_delete($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );

    const { out_status, out_message, out_result } = result.rows[0] || {};

    res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteContentWishlist:", error);
    next(error);
  }
};

module.exports = {
  getAllContentWishlist,
  getContentWishlistById,
  createContentWishlist,
  updateContentWishlist,
  deleteContentWishlist,
};

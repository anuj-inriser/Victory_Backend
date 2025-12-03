const getPool = require("../db/db.js");

const removeFromWatchlist = async (req, res) => {
  const pool = getPool();
  const { user_id, wishlist_id, script_id } = req.body;

  // 🔹 Input validation (same strict style as GET)
  if (!user_id || !wishlist_id || !script_id) {
    return res.status(400).json({
      success: false,
      message: 'user_id, wishlist_id, and script_id are required'
    });
  }

  try {
    // Step 2: Delete the stock
    const deleteResult = await pool.query(
      `DELETE FROM content_wishlist 
       WHERE wishlist_id = $1 AND script_id = $2 and user_id =$3`,
      [wishlist_id, script_id, user_id]
    );

    // Step 3: Respond
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found in watchlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock removed successfully'
    });

  } catch (err) {
    console.error('[Remove From Watchlist Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const getWatchlistStocks = async (req, res) => {
  const { wishlist_id } = req.query;

  if (!wishlist_id) {
    return res.status(400).json({
      success: false,
      error: 'wishlist_id is required',
    });
  }

  const pool = getPool();

  try {
    const result = await pool.query(
      `SELECT 
        *
       FROM content_wishlist cw
       JOIN script s ON cw.script_id = s.script_id
       WHERE cw.wishlist_id = $1
       ORDER BY cw.created_at DESC`,
      [wishlist_id]
    );

    const stocks = result.rows; // array of full objects

    res.json({
      success: true,
      data: stocks, // e.g. [{ symbol: "SBIN-EQ", name: "State Bank...", token: "3045", ... }]
    });
  } catch (err) {
    console.error('❌ getWatchlistStocks DB error:', err);
    res.status(500).json({
      success: false,
      error: 'Database error',
    });
  }
};

// controllers/watchlistController.js
const addToWatchlist = async (req, res) => {
  const { script_id, user_id, wishlist_id } = req.body;

  if (!script_id || !user_id || !wishlist_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const pool = getPool();

  try {
    // 🔥 Single query: insert if new, ignore if exists
    const result = await pool.query(
      `INSERT INTO content_wishlist 
       (script_id, user_id, wishlist_id, created_at, updated_at, content_id)
       VALUES ($1, $2, $3, NOW(), NOW(), 0)
       ON CONFLICT (script_id, user_id, wishlist_id) DO NOTHING
       RETURNING id`,
      [script_id, user_id, wishlist_id]
    );

    if (result.rows.length > 0) {
      return res.status(201).json({
        success: true,
        message: "Added to watchlist",
        data: { id: result.rows[0].id }
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Already in watchlist"
      });
    }
  } catch (err) {
    console.error("DB Error:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }
  }
};
/* ----------------------------------------------------
   GET ALL WISHLISTS
---------------------------------------------------- */
const getAllWishlistControlTable = async (req, res, next) => {
  const pool = getPool();
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({
      status: false,
      message: "user_id is required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT wishlist_id, user_id, wishlist_name, created_at, updated_at
       FROM wishlist_control_table
       WHERE user_id = $1
       ORDER BY wishlist_id ASC`,
      [user_id]
    );

    return res.status(200).json({
      status: true,
      message: "Fetched user-wise wishlist",
      data: result.rows,
    });

  } catch (error) {
    console.error("Error in getAllWishlistControlTable:", error);
    next(error);
  }
};


/* ----------------------------------------------------
   GET ONE BY ID
---------------------------------------------------- */
const getWishlistControlTableById = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT wishlist_id, user_id, wishlist_name, created_at, updated_at
       FROM wishlist_control_table
       WHERE wishlist_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Wishlist record not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Wishlist record fetched",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error in getWishlistControlTableById:", error);
    next(error);
  }
};

/* ----------------------------------------------------
   CREATE (INSERT)
---------------------------------------------------- */
const createWishlistControlTable = async (req, res, next) => {
  const pool = getPool();
  const { user_id, wishlist_name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO wishlist_control_table (user_id, wishlist_name, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING wishlist_id`,
      [user_id || null, wishlist_name]
    );

    return res.status(201).json({
      status: true,
      message: "Wishlist created successfully",
      id: result.rows[0].wishlist_id,
    });

  } catch (error) {
    console.error("Error in createWishlistControlTable:", error);
    next(error);
  }
};

/* ----------------------------------------------------
   UPDATE
---------------------------------------------------- */
const updateWishlistControlTable = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;
  const { wishlist_name, user_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE wishlist_control_table
       SET wishlist_name = $1,
           user_id = $2,
           updated_at = NOW()
       WHERE wishlist_id = $3
       RETURNING wishlist_id`,
      [wishlist_name, user_id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Wishlist not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Wishlist updated successfully",
      id: result.rows[0].wishlist_id,
    });

  } catch (error) {
    console.error("Error in updateWishlistControlTable:", error);
    next(error);
  }
};

/* ----------------------------------------------------
   DELETE
---------------------------------------------------- */
const deleteWishlistControlTable = async (req, res, next) => {
  const pool = getPool();
  const { id } = req.params;
  const userId = req.query.user_id; // ✅ Get from query param (frontend bhejega)

  // 🔐 Validate: both required
  if (!id || !userId) {
    return res.status(400).json({
      status: false,
      message: "wishlist_id and user_id are required"
    });
  }

  // Optional: Type safety (if UUID, cast/check)
  // if (typeof userId !== 'string' || !/^[0-9a-f-]{36}$/.test(userId)) { ... }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 🔹 Step 1: Verify wishlist belongs to this user
    const checkResult = await client.query(
      `SELECT wishlist_id 
       FROM wishlist_control_table 
       WHERE wishlist_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        status: false,
        message: "Access denied or wishlist not found"
      });
    }

    // 🔹 Step 2: Delete related items
    const deleteContentResult = await client.query(
      `DELETE FROM content_wishlist 
       WHERE wishlist_id = $1 AND user_id = $2`,
      [id, userId]
    );

    // 🔹 Step 3: Delete main wishlist
    const deleteWishlistResult = await client.query(
      `DELETE FROM wishlist_control_table 
       WHERE wishlist_id = $1 AND user_id = $2
       RETURNING wishlist_id`,
      [id, userId]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      status: true,
      message: "Wishlist and all its items deleted successfully",
      deletedWishlistId: id,
      deletedContentCount: deleteContentResult.rowCount
    });

  } catch (error) {
    await client?.query('ROLLBACK');
    console.error("❌ DB Error in deleteWishlistControlTable:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  } finally {
    client?.release();
  }
};
// const deleteWishlistControlTable = async (req, res, next) => {
//   const pool = getPool();
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       `DELETE FROM wishlist_control_table
//        WHERE wishlist_id = $1
//        RETURNING wishlist_id`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "Wishlist not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Wishlist deleted successfully",
//       id: result.rows[0].wishlist_id,
//     });

//   } catch (error) {
//     console.error("Error in deleteWishlistControlTable:", error);
//     next(error);
//   }
// };

module.exports = {
  getAllWishlistControlTable,
  getWishlistControlTableById,
  createWishlistControlTable,
  updateWishlistControlTable,
  deleteWishlistControlTable,
  addToWatchlist,
  getWatchlistStocks,
  removeFromWatchlist
};
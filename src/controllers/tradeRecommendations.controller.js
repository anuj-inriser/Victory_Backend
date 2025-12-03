const e = require("express");
const getpool = require("../db/db.js");

// const getTradeRecommendations = async (req, res, next) => {
//   const pool = getpool();

//   const limit = Number(req.query.limit) || 50;
//   const offset = Number(req.query.offset) || 0;
//   try {
//     const result = await pool.query(
//       `SELECT tr.*, s."script_id",s."token",s."script_name",st."scriptTypeId",
//       st."scriptTypeName" FROM trade_recommendations tr
//       LEFT JOIN script s ON tr."script" = s."script_id"
//       LEFT JOIN script_type st ON tr."scriptTypeId" = st."scriptTypeId"
//        ORDER BY tr.\"createdAt\" DESC LIMIT $1 OFFSET $2`,
//       [limit, offset]
//     );
//     res.status(200).json({
//       message: "TradeRecommendations fetched successfully",
//       data: result.rows,
//     });
//   } catch (error) {
//     console.log("Error in fetching tradeRecommendations =", error);
//     next(error);
//   }
// };

// const getAllTradeRecommendations = async (req, res, next) => {
//   const pool = getpool();

//   try {
//     const result = await pool.query(
//       `SELECT tr.*, tt.\"tradeTypeName\" FROM
//       trade_recommendations tr
//       LEFT JOIN trade_type tt
//       ON tr.\"tradeTypeId\" = tt.\"tradeTypeId\" `
//     );
//     res.status(200).json({
//       message: "TradeRecommendations fetched successfully",
//       data: result.rows,
//     });
//   } catch (error) {
//     console.log("Error in fetching tradeRecommendations =", error);
//     next(error);
//   }
// };

// const createTradeRecommendations = async (req, res, next) => {
//   const pool = getpool();
//   try {
//     const jsonData = { ...req.body };
//     const result = await pool.query(
//       "Call trade_recommendations_create($1,null,null,null)",
//       [JSON.stringify(jsonData)]
//     );
//     const { out_message, out_status, out_result } = result.rows[0];

//     if (out_status) {
//       return res.status(200).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     } else {
//       return res.status(400).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     }
//   } catch (error) {
//     console.log("Error in creating tradeRecommendations =", error);
//     next(error);
//   }
// };

const getTradeRecommendations = async (req, res, next) => {
  const pool = getpool();

  // Pagination
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;

  // Filters from query params
  const {
    search,
    status,
    type,
    createdFrom,
    createdTo,
    exitFrom,
    exitTo
  } = req.query;

  try {
    // Base query parts
    let query = `
      SELECT 
        tr.*, 
        s."script_id",
        s."token",
        s."script_name",
        st."scriptTypeId",
        st."scriptTypeName"
      FROM trade_recommendations tr
      LEFT JOIN script s ON tr."script" = s."script_id"
      LEFT JOIN script_type st ON tr."scriptTypeId" = st."scriptTypeId"
    `;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // 1. Search by script_name (case-insensitive partial match)
    if (search) {
      conditions.push(`LOWER(s."script_name") LIKE LOWER($${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 2. Filter by status (exact match)
    if (status) {
      conditions.push(`tr."status" = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    // 3. Filter by type (scriptTypeId)
    if (type) {
      const typeId = Number(type);
      if (!isNaN(typeId)) {
        conditions.push(`tr."scriptTypeId" = $${paramIndex}`);
        params.push(typeId);
        paramIndex++;
      }
    }

    // 4. Created date range (createdAt)
    if (createdFrom) {
      conditions.push(`tr."createdAt" >= $${paramIndex}`);
      params.push(createdFrom);
      paramIndex++;
    }
    if (createdTo) {
      // Add time to end of day to include full day
      const createdToEnd = new Date(createdTo);
      createdToEnd.setUTCHours(23, 59, 59, 999);
      conditions.push(`tr."createdAt" <= $${paramIndex}`);
      params.push(createdToEnd.toISOString());
      paramIndex++;
    }

    // 5. Exit date range (exitDate)
    if (exitFrom) {
      conditions.push(`tr."exitDate" >= $${paramIndex}`);
      params.push(exitFrom);
      paramIndex++;
    }
    if (exitTo) {
      const exitToEnd = new Date(exitTo);
      exitToEnd.setUTCHours(23, 59, 59, 999);
      conditions.push(`tr."exitDate" <= $${paramIndex}`);
      params.push(exitToEnd.toISOString());
      paramIndex++;
    }

    // Append WHERE clause if any conditions exist
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ordering and pagination
    query += ` ORDER BY tr."createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Execute query
    const result = await pool.query(query, params);

    res.status(200).json({
      message: "Trade recommendations fetched successfully",
      data: result.rows,
      total: result.rows.length, // Optional: add total count separately if needed
    });
  } catch (error) {
    console.error("Error in fetching trade recommendations:", error);
    next(error);
  }
};

const getAllTradeRecommendations = async (req, res, next) => {
  const pool = getpool();

  try {
    const { status, scriptTypeId } = req.query; // Receive filter from frontend

    let query = `
      SELECT tr.*, tt."tradeTypeName", st."script_name", st."token"
      FROM trade_recommendations tr
      LEFT JOIN trade_type tt ON tr."tradeTypeId" = tt."tradeTypeId"
      LEFT JOIN script st ON tr."script" = st."script_id"
      WHERE 1=1
    `;

    const params = [];

    // ✔ Apply status filter when not "All"
    if (status && status !== "All") {
      params.push(status);
      query += ` AND tr.status = $${params.length}`;
    }

    if (scriptTypeId) {
      params.push(scriptTypeId);
      query += ` AND tr."scriptTypeId" = $${params.length}`;
    }

    query += ` ORDER BY tr."createdAt" DESC`;

    const result = await pool.query(query, params);

    return res.status(200).json({
      message: "TradeRecommendations fetched successfully",
      data: result.rows,
    });

  } catch (error) {
    console.log("Error fetching trade recommendations:", error);
    next(error);
  }
};


const toNull = (val) => (val === "" ? null : val);
const createTradeRecommendations = async (req, res, next) => {
  const pool = getpool();
  try {
    const {
      tradeRecommendationId,
      tradeTypeId,
      script,
      scriptTypeId,
      recoDate,
      recoTime,
      recoExitDate,
      recoPriceLow,
      recoPriceHigh,
      targetOne,
      targetTwo,
      targetThree,
      targetOneStatus,
      targetTwoStatus,
      targetThreeStatus,
      stopLoss,
      status,
      exitTypeId,
      exitDate,
      entryNote,
      exitTime,
      exitPriceLow,
      exitPriceHigh,
      userId,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO trade_recommendations (
        "tradeRecommendationId",
        "tradeTypeId",
        "script",
        "scriptTypeId",
        "recoDate",
        "recoTime",
        "recoExitDate",
        "recoPriceLow",
        "recoPriceHigh",
        "targetOne",
        "targetTwo",
        "targetThree",
        "targetOneStatus",
        "targetTwoStatus",
        "targetThreeStatus",
        "stopLoss",
        "status",
        "exitTypeId",
        "exitDate",
        "entryNote",
        "exitTime",
        "exitPriceLow",
        "exitPriceHigh",
        "userId"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21 , $22, $23 , $24 
      )
      RETURNING "tradeId";`,
      [
        tradeRecommendationId,
        tradeTypeId,
        script,
        scriptTypeId,
        toNull(recoDate),
        toNull(recoTime),
        toNull(recoExitDate),
        recoPriceLow,
        recoPriceHigh,
        targetOne,
        targetTwo,
        targetThree,
        targetOneStatus,
        targetTwoStatus,
        targetThreeStatus,
        stopLoss,
        status,
        exitTypeId,
        toNull(exitDate),
        entryNote,
        toNull(exitTime),
        exitPriceLow,
        exitPriceHigh,
        userId,
      ]
    );

    const newRecord = result.rows[0];
    return res.status(201).json({
      status: true,
      message: "Trade recommendation created successfully",
      result: newRecord,
    });

  } catch (error) {
    console.log("Error in creating tradeRecommendations =", error);
    next(error);
  }
};

// const updateTradeRecommendations = async (req, res, next) => {
//   const pool = getpool();
//   try {
//     const { id } = req.params;

//     const jsonData = { ...req.body, id, userId: 50 };

//     const result = await pool.query(
//       "Call trade_recommendations_update($1,null,null,null)",
//       [JSON.stringify(jsonData)]
//     );
//     const { out_message, out_status, out_result } = result.rows[0];

//     if (out_status) {
//       return res.status(200).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     } else {
//       return res.status(400).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     }
//   } catch (error) {
//     console.log("Error in updating tradeRecommendations =", error);
//     next(error);
//   }
// };

const updateTradeRecommendations = async (req, res, next) => {
  const pool = getpool();
  try {
    const { id } = req.params;

    const {
      tradeRecommendationId,
      tradeTypeId,
      script,
      scriptTypeId,
      recoDate,
      recoTime,
      recoExitDate,
      recoPriceLow,
      recoPriceHigh,
      targetOne,
      targetTwo,
      targetThree,
      targetOneStatus,
      targetTwoStatus,
      targetThreeStatus,
      stopLoss,
      status,
      exitTypeId,
      exitDate,
      exitTime,
      exitPriceLow,
      exitPriceHigh,
      entryNote,
      userId,
    } = req.body;

    // Optional: Validate that `id` exists
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const result = await pool.query(
      `UPDATE trade_recommendations
       SET
         "tradeRecommendationId" = $1,
         "tradeTypeId" = $2,
         "script" = $3,
         "scriptTypeId" = $4,
         "recoDate" = $5,
         "recoTime" = $6,
         "recoExitDate" = $7,
         "recoPriceLow" = $8,
         "recoPriceHigh" = $9,
         "targetOne" = $10,
         "targetTwo" = $11,
         "targetThree" = $12,
         "targetOneStatus" = $13,
         "targetTwoStatus" = $14,
         "targetThreeStatus" = $15,
         "stopLoss" = $16,
         "status" = $17,
         "exitTypeId" = $18,
         "exitDate" = $19,
         "exitTime" = $20,
         "exitPriceLow" = $21,
         "exitPriceHigh" = $22,
         "entryNote" = $23,
         "userId" = $24,
         "updatedAt" = NOW() 
       WHERE "tradeId" = $25
       RETURNING *;`,
      [
        tradeRecommendationId,
        tradeTypeId,
        script,
        scriptTypeId,
        toNull(recoDate),
        toNull(recoTime),
        toNull(recoExitDate),
        recoPriceLow,
        recoPriceHigh,
        targetOne,
        targetTwo,
        targetThree,
        targetOneStatus,
        targetTwoStatus,
        targetThreeStatus,
        stopLoss,
        status,
        toNull(exitTypeId),
        toNull(exitDate),
        toNull(exitTime),
        exitPriceLow,
        exitPriceHigh,
        entryNote,
        userId,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Trade recommendation not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Trade recommendation updated successfully",
      result: result.rows[0],
    });

  } catch (error) {
    console.log("Error in updating tradeRecommendations =", error);
    next(error);
  }
};

const getByIdTradeRecommendations = async (req, res, next) => {
  const pool = getpool();
  try {
    const { id } = parseInt(req.params);

    const result = await pool.query(
      "select * from trade_recommendations_getbyid($1)",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "TradeRecommendations not found" });
    }

    res.status(200).json({
      message: "Trade Recommendations by id fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log("Error in fetching tradeRecommendations by id =", error);
    next(error);
  }
};

// const deleteTradeRecommendations = async (req, res, next) => {
//   const pool = getpool();
//   try {
//     const { id } = req.params;

//     const result = await pool.query("Call trade_recommendations_delete($1)", [
//       id,
//     ]);
//     const { out_message, out_status, out_result } = result.rows[0];

//     if (out_status) {
//       return res.status(200).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     } else {
//       return res.status(400).json({
//         status: out_status,
//         message: out_message,
//         result: out_result,
//       });
//     }
//   } catch (error) {
//     console.log("Error in deleting tradeRecommendations =", error);
//     next(error);
//   }
// };

const deleteTradeRecommendations = async (req, res, next) => {
  const pool = getpool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Trade recommendation ID is required",
      });
    }

    const result = await pool.query(
      `DELETE FROM trade_recommendations 
       WHERE "tradeId" = $1 
       RETURNING "tradeId";`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Trade recommendation not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Trade recommendation deleted successfully",
      result: { deletedId: result.rows[0].tradeId },
    });

  } catch (error) {
    console.log("Error in deleting tradeRecommendations =", error);
    next(error);
  }
};

module.exports = {
  getTradeRecommendations,
  getByIdTradeRecommendations,
  createTradeRecommendations,
  updateTradeRecommendations,
  deleteTradeRecommendations,
  getAllTradeRecommendations,
};

const getPool = require("../db/db");
const isSuspiciousInput = require("../utils/security.utils");

const getTradeType = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM trade_type_getall()");

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "TradeType fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching TradeType = ", error);
    next(error);
  }
};

const getByIdSTradeType = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = parseInt(req.params);

    const result = await pool.query("SELECT * FROM trade_type_getbyid($1)", [
      id,
    ]);

    if (result.rows) {
      return res.status(200).json({
        success: "true",
        message: "TradeType by id fetched successfully",
        data: result.rows,
      });
    }
  } catch (error) {
    console.log("Error in Fetching TradeType by id = ", error);
    next(error);
  }
};

module.exports = { getTradeType, getByIdSTradeType };

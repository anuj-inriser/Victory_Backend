const getPool = require("../db/db.js");

const getAllTransactionTypes = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM transaction_type_get_all()");

    return res.status(200).json({
      status: true,
      message: "Fetched all transaction types successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getAllTransactionTypes:", error);
    next(error);
  }
};

const getTransactionTypeById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM transaction_type_get_by_id($1)",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched transaction type successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Transaction type not found",
      });
    }
  } catch (error) {
    console.error("Error in getTransactionTypeById:", error);
    next(error);
  }
};

module.exports = {
  getAllTransactionTypes,
  getTransactionTypeById,
};

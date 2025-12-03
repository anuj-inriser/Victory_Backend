const getPool = require("../db/db.js");
const getAllScript = async (req, res) => {
  const pool = getPool();
  try {
    const query = `
      SELECT token, script_id, exchange, script_name
      FROM script
      WHERE exchange = 'NSE'
      ORDER BY script_name ASC;
    `;
    const result = await pool.query(query);

    res.status(200).json({
      status: true,
      message: "Scripts fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch scripts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
module.exports = {
  getAllScript
};
const getPool = require("../db/db.js");

const fetchingCounts = async (req, res, next) => {
  const pool = getPool();
  try {
    const query = `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS "totalUsers",
        (SELECT COUNT(*)::int FROM ra_table) AS "totalAnalysts",
        (SELECT COUNT(*)::int FROM news_feed) AS "totalPosts",
        (SELECT COUNT(*)::int FROM grievances where complaint_status = 'Opened') AS "totalGrievance",
        (SELECT COUNT(*)::int FROM red_flags WHERE red_flag_status_id = 1) AS "totalOpenRedFlags"
    `;

    const { rows } = await pool.query(query);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.log("Error fetching count:", error);
    next(error);
  }
};

module.exports = { fetchingCounts };

const getPool= require("../db/db.js"); // adjust path to your db pool

const getNextUserId = async () => {
  const pool = getPool();
  const result = await pool.query("SELECT COALESCE(MAX(userid), 0)+1 AS nextid FROM users");
  return result.rows[0].nextid;
};

module.exports = { getNextUserId };

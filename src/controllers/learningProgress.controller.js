const getPool = require("../db/db.js");

// Upsert progress for a user/module/(optional)chapter — idempotent: will NOT duplicate
const updateProgress = async (req, res, next) => {
    const pool = getPool();
    const { userid, moduleid, chapterid = null, progress } = req.body;

    if (!userid || !moduleid || typeof progress !== "number") {
        return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    try {
        // Check if an entry already exists for this user+module+chapter (chapter may be null)
        const existsQuery = `
      SELECT id, progress_percentage
      FROM learning_progress
      WHERE userid = $1 AND moduleid = $2 AND 
            (${chapterid === null ? "chapterid IS NULL" : "chapterid = $3"})
      LIMIT 1
    `;

        const existsParams = chapterid === null ? [userid, moduleid] : [userid, moduleid, chapterid];
        const existsResult = await pool.query(existsQuery, existsParams);

        if (existsResult.rowCount > 0) {
            // entry already exists -> no duplicate increment; return existing progress
            return res.status(200).json({
                status: true,
                message: "Progress already recorded",
                data: { id: existsResult.rows[0].id, progress: Number(existsResult.rows[0].progress_percentage) }
            });
        }

        // Insert new progress row
        const insertQuery = `
      INSERT INTO learning_progress (userid, moduleid, chapterid, progress_percentage)
      VALUES ($1, $2, $3, $4)
      RETURNING id, progress_percentage
    `;
        const insertParams = [userid, moduleid, chapterid, progress];
        const insertResult = await pool.query(insertQuery, insertParams);

        return res.status(201).json({
            status: true,
            message: "Progress saved",
            data: { id: insertResult.rows[0].id, progress: Number(insertResult.rows[0].progress_percentage) }
        });
    } catch (err) {
        console.error("Error in updateProgress:", err);
        next(err);
    }
};

// Get total progress for a user+module (sums module and chapter rows)
const getModuleProgress = async (req, res, next) => {
    const pool = getPool();
    const { userId, moduleId } = req.params;

    if (!userId || !moduleId) {
        return res.status(400).json({ status: false, message: "Missing params" });
    }

    try {
        const q = `
            SELECT COALESCE(SUM(progress_percentage), 0)::numeric(5,2) AS total_progress
            FROM learning_progress
            WHERE userid = $1 AND moduleid = $2
    `;
        const result = await pool.query(q, [userId, moduleId]);
        const total = Number(result.rows[0].total_progress);
        return res.status(200).json({ status: true, data: { progress: total } });
    } catch (err) {
        console.error("Error in getModuleProgress:", err);
        next(err);
    }
};

// Get chapters completed list + count + percentage computed (optional endpoint)
const getChapterProgressSummary = async (req, res, next) => {
    const pool = getPool();
    const { userId, moduleId } = req.params;

    if (!userId || !moduleId) {
        return res.status(400).json({ status: false, message: "Missing params" });
    }

    try {
        // get total chapters count for module
        const chapterIdsRes = await pool.query(
            `SELECT chapterid FROM learningmodules WHERE moduleid = $1`, [moduleId]
        );
        const chapterIds = chapterIdsRes.rows.map(r => r.chapterid);
        const totalChapters = chapterIds.length;

        // get completed chapter ids for user (rows with non-null chapterid)
        const completedRes = await pool.query(
            `SELECT chapterid FROM learning_progress WHERE userid = $1 AND moduleid = $2 AND chapterid IS NOT NULL`,
            [userId, moduleId]
        );
        const completed = completedRes.rows.map(r => r.chapterid);

        // compute total progress (sum of rows)
        const sumRes = await pool.query(
            `SELECT COALESCE(SUM(progress_percentage),0)::numeric(5,2) as total FROM learning_progress WHERE userid=$1 AND moduleid=$2`,
            [userId, moduleId]
        );
        const totalProgress = Number(sumRes.rows[0].total);

        return res.status(200).json({
            status: true,
            data: {
                totalChapters,
                completedChapters: completed,
                progress: totalProgress
            }
        });
    } catch (err) {
        console.error("Error in getChapterProgressSummary:", err);
        next(err);
    }
};

module.exports = {
    updateProgress,
    getModuleProgress,
    getChapterProgressSummary
};

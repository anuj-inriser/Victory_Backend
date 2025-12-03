const getPool = require("../db/db.js");


const createLearningModule = async (req, res, next) => {
    const pool = getPool();
    const { topicheading, content, moduleid, chapterid } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO learningmodules (topicheading, content, moduleid, chapterid) VALUES ($1, $2, $3, $4) RETURNING id",
            [topicheading, content, moduleid, chapterid]
        );

        res.status(201).json({ id: result.rows[0].id, ...req.body });
    } catch (error) {
        next(error);
    }
};

const getAllLearningModules = async (req, res, next) => {
    const pool = getPool();

    try {
        const result = await pool.query(
            `
            SELECT lm.id, lm.topicheading, lm.content, lmm.module_name, lmm.moduleid, cm.chapterid, cm.chapter_name FROM learningmodules lm LEFT JOIN learning_module_master lmm ON lm.moduleid = lmm.moduleid LEFT JOIN chapter_master cm ON lm.chapterid = cm.chapterid`);
        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

const getLearningModuleById = async (req, res, next) => {
    const pool = getPool();
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM learningmodules WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Learning module not found",
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

const updateLearningModule = async (req, res, next) => {
    const pool = getPool();
    const { id } = req.params;
    const { topicheading, content, moduleid, chapterid } = req.body;

    try {
        const result = await pool.query(
            "UPDATE learningmodules SET topicheading = $1, content = $2, moduleid = $3, chapterid = $4 WHERE id = $5",
            [topicheading, content, moduleid, chapterid, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Learning module not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Learning module updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

const deleteLearningModule = async (req, res, next) => {
    const pool = getPool();
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM learningmodules WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Learning module not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Learning Module deleted successfully",
            id,
        });
    } catch (error) {
        next(error);
    }
};

const getChapterDetailsChapterScreen = async (req, res, next) => {
    const pool = getPool();
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT topicheading, content FROM learningmodules WHERE chapterid = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Learning module not found",
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLearningModule,
    getAllLearningModules,
    deleteLearningModule,
    getLearningModuleById,
    updateLearningModule,
    getChapterDetailsChapterScreen
};
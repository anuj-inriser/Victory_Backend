const getPool = require("../db/db.js");
const path = require("path");
const fs = require("fs");


const getAllChapterMaster = async (req, res, next) => {
    const pool = getPool();
    try {
        const result = await pool.query("SELECT * FROM chapter_master");

        return res.status(200).json({
            status: true,
            message: "Chapter data fetched successfully",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error in getAllChapterMaster:", error);
        next(error);
    }
};

const createChapterMaster = async (req, res, next) => {
    const pool = getPool();

    try {
        const { chaptername, chapterbrief } = req.body;

        if (!chaptername || !chapterbrief) {
            return res.status(400).json({
                status: false,
                message: "Chapter Name and Chapter Brief are required",
            });
        }

        const query = `
      INSERT INTO chapter_master (chapter_name, chapter_brief, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING chapterid;
    `;

        const values = [chaptername, chapterbrief];

        const result = await pool.query(query, values);

        return res.status(201).json({
            status: true,
            message: "Chapter Created Successfully",
            id: result.rows[0].chapterid,
        });

    } catch (error) {
        console.error("Error in createChapterMaster:", error);
        next(error);
    }
};

const deleteChapterMaster = async (req, res, next) => {
    const pool = getPool();
    try {
        let { id } = req.params;
        id = Number(id);

        const query = `
      DELETE FROM chapter_master
      WHERE chapterid = $1
    `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Chapter deleted successfully",
        });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                status: false,
                message: "Cannot delete: This chapter is linked to learning content.",
            });
        }

        console.error("Error in deleteChapterMaster:", error);
        next(error);
    }
};

const getChapterMasterById = async (req, res, next) => {
    const pool = getPool();
    try {
        let { id } = req.params;
        id = Number(id);

        const query = `
      SELECT * FROM chapter_master
      WHERE chapterid = $1
    `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Chapter fetched successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error in getChapterMasterById:", error);
        next(error);
    }
};

const getChapterMasterByModuleId = async (req, res, next) => {
    const pool = getPool();

    try {
        let { id } = req.params;
        // Step 1: Get all chapter IDs for this module
        const chapterQuery = `
        SELECT chapterid 
        FROM learningmodules
        WHERE moduleid = $1
      `;

        const chapterResult = await pool.query(chapterQuery, [id]);

        if (chapterResult.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "No chapters found for this module",
            });
        }

        const chapterIds = chapterResult.rows.map(row => row.chapterid);

        // Step 2: Fetch chapter details for all chapter IDs
        const chaptersQuery = `
        SELECT *
        FROM chapter_master
        WHERE chapterid = ANY($1::int[])
      `;

        const chaptersResult = await pool.query(chaptersQuery, [chapterIds]);
        
        return res.status(200).json({
            status: true,
            message: "Chapters fetched successfully",
            data: chaptersResult.rows, // returns array of chapters
        });

    } catch (error) {
        console.error("Error in getChapterMasterByModuleId:", error);
        next(error);
    }
};


const updateChapterMaster = async (req, res, next) => {
    const pool = getPool();
    try {
        let { id } = req.params;
        id = Number(id);
        const { chaptername, chapterbrief } = req.body;
        const query = `
      UPDATE chapter_master
      SET chapter_name = $1, chapter_brief = $2, updated_at = NOW()
      WHERE chapterid = $3
    `;

        const values = [chaptername, chapterbrief, id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Chapter updated successfully",
        });
    } catch (error) {
        console.error("Error in updateChapterMaster:", error);
        next(error);
    }
};

module.exports = {
    createChapterMaster,
    getAllChapterMaster,
    deleteChapterMaster,
    getChapterMasterById,
    updateChapterMaster,
    getChapterMasterByModuleId
};
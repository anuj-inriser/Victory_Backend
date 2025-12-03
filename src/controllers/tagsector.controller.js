const getPool = require("../db/db.js")


const getAllTagSectors = async (req, res, next) => {
    const pool = getPool();
    try {

        const query = `
      SELECT * from sector_master
    `;

        const result = await pool.query(query);


        res.status(200).json({
            message: "Grievances fetched successfully",
            data: result.rows
        });

    } catch (error) {
        console.error("Error in fetching grievances =", error);
        next(error);
    }
};

module.exports = {
    getAllTagSectors,
}
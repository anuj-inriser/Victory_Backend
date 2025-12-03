const getPool = require("../db/db.js")


const getAllTagIndustries = async (req, res, next) => {
    const pool = getPool();
    try {

        const query = `
      SELECT * from industrymaster
    `;

        const result = await pool.query(query);


        res.status(200).json({
            message: "Industries fetched successfully",
            data: result.rows
        });

    } catch (error) {
        console.error("Error in fetching Industries :", error);
        next(error);
    }
};

module.exports = {
    getAllTagIndustries,
}
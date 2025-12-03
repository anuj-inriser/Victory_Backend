const getPool = require("../db/db.js");
const path = require("path")
const fs = require("fs")

const getAllNewsFeeds = async (req, res, next) => {
  const pool = getPool();

  try {
    // Read query params correctly
    const {
      page = 1,
      limit = 10,
      publish_from,
      publish_to
    } = req.query;

    const offset = (page - 1) * limit;

    // Build dynamic filters
    let conditions = [];
    let values = [];
    let index = 1;

    if (publish_from) {
      conditions.push(`nf.publication_date >= $${index++}`);
      values.push(publish_from);
    }

    if (publish_to) {
      conditions.push(`nf.publication_date <= $${index++}`);
      values.push(publish_to);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Main paginated query
    const dataQuery = `
      SELECT nf.*
      FROM news_feed nf
      ${whereClause}
      ORDER BY nf.publication_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM news_feed nf
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, values),
      pool.query(countQuery, values)
    ]);

    const totalItems = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: true,
      message: "Fetched all news feeds successfully",
      data: dataResult.rows,
      totalPages,
      totalItems
    });

  } catch (error) {
    console.error("Error in getAllNewsFeeds:", error);
    next(error);
  }
};


const getPublishedNewsFeed = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      `SELECT nf.news_id, nf.publisher, nf.title,nf.publication_date,nf.publish_time,nf.brief_description,news_content,
      nf.image_url,nf.created_at,nf.ispublished,nf.published_at,
       nc.name AS "news_category_name"
       FROM news_feed nf
       LEFT JOIN news_category nc ON nf.news_category = nc.id
       WHERE nf.ispublished = 1
       ORDER BY nf.published_at DESC`
    );

    return res.status(200).json({
      status: true,
      message: "Fetched published news feeds successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in getPublishedNewsFeed:", error);
    next(error);
  }
};

const getNewsFeedById = async (req, res, next) => {
  const pool = getPool();
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM news_feed WHERE news_id = $1",
      [id]
    );


    if (result.rows[0].publication_date) {
      result.rows[0].publication_date = result.rows[0].publication_date
        .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    }


    if (result.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Fetched news feed successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "News feed not found",
      });
    }
  } catch (error) {
    console.error("Error in getNewsFeedById:", error);
    next(error);
  }
};

const createNewsFeed = async (req, res, next) => {
  const pool = getPool();

  try {
    const {
      publisher,
      title,
      link,
      publication_date,
      publish_time,
      brief_description,
      news_content,
      credit,
      source_url,
      destination_url,
      tags_stocks,
      tags_sectors,
      tags_industries,
    } = req.body;

    const parsed_tags_stocks = Array.isArray(tags_stocks)
      ? tags_stocks
      : JSON.parse(tags_stocks || "[]");

    const parsed_tags_sectors = Array.isArray(tags_sectors)
      ? tags_sectors
      : JSON.parse(tags_sectors || "[]");

    const parsed_tags_industries = Array.isArray(tags_industries)
      ? tags_industries
      : JSON.parse(tags_industries || "[]");


    const moduleimage = req.file ? req.file.filename : null;


    const result = await pool.query(
      `INSERT INTO news_feed
      (publisher, title, link, publication_date, publish_time, brief_description, news_content, credit, image_url, source_url, destination_url, tags_stocks, tags_sectors, tags_industries)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        publisher,
        title,
        link,
        publication_date,
        publish_time,
        brief_description,
        news_content,
        credit,
        moduleimage,
        source_url,
        destination_url,
        JSON.stringify(parsed_tags_stocks),
        JSON.stringify(parsed_tags_sectors),
        JSON.stringify(parsed_tags_industries)
      ]
    );

    return res.status(200).json({
      status: true,
      message: "✅ News feed created successfully",
      news: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error in createNewsFeed:", error);
    next(error);
  }
};


// const updateNewsFeed = async (req, res, next) => {
//   const pool = getPool();

//   try {
//     const news_id = Number(req.params.id);

//     const {
//       publisher,
//       title,
//       link,
//       publication_date,
//       publish_time,
//       brief_description,
//       news_content,
//       news_category,
//       credit,
//       source_url,
//       destination_url,
//       tags_stocks,
//       tags_sectors,
//       tags_industries,
//       old_image_url,
//     } = req.body;

//     const parsed_tags_stocks = tags_stocks ? JSON.parse(tags_stocks) : [];
//     const parsed_tags_sectors = tags_sectors ? JSON.parse(tags_sectors) : [];
//     const parsed_tags_industries = tags_industries ? JSON.parse(tags_industries) : [];

//     // ✅ If new image uploaded → use new one, else keep old image
//     const moduleimage = req.file ? req.file.filename : old_image_url;

//     const result = await pool.query(
//       `UPDATE news_feed
//       SET publisher=$1, title=$2, link=$3, publication_date=$4, publish_time=$5,
//           brief_description=$6, news_content=$7, credit=$8, image_url=$9,
//           source_url=$10, destination_url=$11, tags_stocks=$12,
//           tags_sectors=$13, tags_industries=$14, news_category=$15
//       WHERE news_id=$16
//       RETURNING *`,
//       [
//         publisher,
//         title,
//         link,
//         publication_date,
//         publish_time,
//         brief_description,
//         news_content,
//         credit,
//         moduleimage,
//         source_url,
//         destination_url,
//         JSON.stringify(parsed_tags_stocks),
//         JSON.stringify(parsed_tags_sectors),
//         JSON.stringify(parsed_tags_industries),
//         news_category,
//         news_id
//       ]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "❌ News not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "✅ News feed updated successfully",
//       news: result.rows[0],
//     });

//   } catch (error) {
//     console.error("❌ Error in updateNewsFeed:", error);
//     next(error);
//   }
// };

const updateNewsFeed = async (req, res, next) => {
  const pool = getPool();

  try {
    const news_id = Number(req.params.id);

    // ✅ First get existing record to keep old image
    const existing = await pool.query(
      `SELECT image_url FROM news_feed WHERE news_id = $1`,
      [news_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "❌ News not found",
      });
    }

    const oldImage = existing.rows[0].image_url;

    const {
      publisher,
      title,
      link,
      publication_date,
      publish_time,
      brief_description,
      news_content,
      news_category,
      credit,
      source_url,
      destination_url,
      tags_stocks,
      tags_sectors,
      tags_industries,
    } = req.body;

    // Convert JSON arrays safely
    const parsed_tags_stocks = tags_stocks ? JSON.parse(tags_stocks) : [];
    const parsed_tags_sectors = tags_sectors ? JSON.parse(tags_sectors) : [];
    const parsed_tags_industries = tags_industries ? JSON.parse(tags_industries) : [];

    // ✅ If new image uploaded → use new one, else keep old one
    const moduleimage = req.file ? req.file.filename : oldImage;

    const result = await pool.query(
      `UPDATE news_feed
      SET publisher=$1, title=$2, link=$3, publication_date=$4, publish_time=$5, 
          brief_description=$6, news_content=$7, credit=$8, image_url=$9, 
          source_url=$10, destination_url=$11, tags_stocks=$12, 
          tags_sectors=$13, tags_industries=$14, news_category=$15
      WHERE news_id=$16
      RETURNING *`,
      [
        publisher,
        title,
        link,
        publication_date,
        publish_time,
        brief_description,
        news_content,
        credit,
        moduleimage, // ✅ Now safe
        source_url,
        destination_url,
        JSON.stringify(parsed_tags_stocks),
        JSON.stringify(parsed_tags_sectors),
        JSON.stringify(parsed_tags_industries),
        news_category,
        news_id
      ]
    );

    if (req.file && oldImage) {
      const oldImagePath = path.join(process.cwd(), "uploads/newsimages", oldImage);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Could not delete old news image:", err.message);
      });
    }

    return res.status(200).json({
      status: true,
      message: "✅ News feed updated successfully",
      news: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error in updateNewsFeed:", error);
    next(error);
  }
};


const deleteNewsFeed = async (req, res, next) => {
  const pool = getPool();
  // const jsonData = { news_id: parseInt(req.params.news_id, 10) };

  const { id } = req.params;

  const existing = await pool.query(
    `SELECT image_url FROM news_feed WHERE news_id = $1`,
    [id]
  );

  const oldImage = existing.rows[0].image_url;

  if (oldImage) {
    const oldImagePath = path.join(process.cwd(), "uploads/newsimages", oldImage);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.log("Could not delete old news image:", err.message);
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM news_feed WHERE news_id = $1 RETURNING news_id",
      [id]
    );


    if (result.rowCount > 0) {
      return res.status(200).json({
        status: true,
        message: "✅ News article deleted successfully",
        news_id: result.rows[0].news_id,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "❌ News article not found",
      });
    }
  } catch (error) {
    console.error("Error in deleteNewsFeed:", error);
    next(error);
  }
};

const getNewsCategories = async (req, res, next) => {
  const pool = getPool();

  try {
    const result = await pool.query("SELECT * FROM news_category");
    return res.status(200).json({
      status: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("Error in getNewsCategories:", error);
    next(error);
  }
};

const publishNewsFeed = async (req, res, next) => {
  try {
    const pool = getPool();

    const news_id = Number(req.params.id);
    const published_by = Number(req.body.published_by);

    const result = await pool.query(`
      UPDATE news_feed SET published_by = $1, ispublished = 1, published_at = NOW() 
      WHERE news_id = $2 RETURNING *`,
      [published_by, news_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "News feed published successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Publish error:", error);
    next(error);
  }
}

module.exports = {
  createNewsFeed,
  updateNewsFeed,
  deleteNewsFeed,
  getAllNewsFeeds,
  getNewsFeedById,
  getNewsCategories,
  publishNewsFeed,
  getPublishedNewsFeed
};
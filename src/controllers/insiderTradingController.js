const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");
require("dotenv").config();
const getPool = require("../db/db.js");

const pool = getPool();

// Configure XML parser to capture attributes (e.g., <source url="...">)
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
});

exports.fetchAndSaveInsider = async (req, res) => {
  const startTime = new Date();

  const feedUrl = "https://nsearchives.nseindia.com/content/RSS/Insider_Trading.xml";
  const cutoffTime = new Date(Date.now() - 5 * 60 * 1000); // last 5 minutes
  const addedArticles = [];

  try {
    // 🧠 Step 1️⃣: Fetch XML feed
    let xmlData, parsed;
    try {
      const response = await axios.get(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; VictoryNewsBot/1.0)" },
      });
      xmlData = response.data;
      parsed = xmlParser.parse(xmlData);
    } catch (err) {
      console.error("💥 Failed to fetch or parse Insider Trading feed:", err.message);
      return res.status(500).json({ success: false, message: "Failed to fetch NSE feed", error: err.message });
    }

    // 🧩 Step 2️⃣: Parse items
    const items = Array.isArray(parsed?.rss?.channel?.item)
      ? parsed.rss.channel.item
      : parsed?.rss?.channel?.item
      ? [parsed.rss.channel.item]
      : [];

    if (items.length === 0) {
      console.warn("⚠️ No items found in the RSS feed.");
      return res.status(404).json({ success: false, message: "No items found in RSS feed" });
    }

    // 🧮 Step 3️⃣: Process & save recent entries (within last 5 min)
    for (const item of items) {
      const title = (item.title || "").trim();
      const link = (item.link || "").trim();
      const description = (item.description || "").trim();
      const pubDate = new Date(item.pubDate);

      if (!title || !link) {
        console.warn("⚠️ Skipping invalid item (missing title/link).");
        continue;
      }

      if (pubDate < cutoffTime) {
        continue;
      }

      // Save into DB
      const query = `
        INSERT INTO insider_trading (title, link, description, pub_date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (link) DO NOTHING
        RETURNING id, title, link;
      `;

      try {
        const result = await pool.query(query, [title, link, description, pubDate]);
        if (result.rows.length > 0) {
          addedArticles.push(result.rows[0]);
        }
      } catch (err) {
        console.error(`💥 DB insert failed for "${title}":`, err.message);
      }
    }

    const endTime = new Date();

    return res.status(200).json({
      success: true,
      message: `Fetched and saved ${addedArticles.length} new article(s).`,
      count: addedArticles.length,
      records: addedArticles,
    });
  } catch (err) {
    console.error("💥 Unhandled error in fetchAndSaveInsider:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
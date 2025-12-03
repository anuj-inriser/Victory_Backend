const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
require('dotenv').config();
const getPool = require('../db/db.js');

const pool = getPool();

// Configure XML parser to capture attributes (e.g., <source url="...">)
const xmlParser = new XMLParser({
  ignoreAttributes: false,          // ← CRITICAL: keep attributes
  attributeNamePrefix: '@_',       // e.g., url → '@_url'
  textNodeName: '#text',
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
});

exports.fetchAndSaveNews = async (req, res) => {
  const startTime = new Date();

  const baseUrl = 'https://news.google.com/rss/search?q=';
  // ⏱️ Your preference: last 5 minutes only
  const cutoffTime = new Date(Date.now() - 5 * 60 * 1000);
  const addedArticles = [];

  try {

    // Step 1️⃣: Get categories
    const catResult = await pool.query('SELECT id, name FROM news_category ORDER BY id;');
    const categories = catResult.rows;

    if (categories.length === 0) {
      return res.status(400).json({ success: false, message: 'No categories found' });
    }

    for (const category of categories) {
      const url = `${baseUrl}${encodeURIComponent(category.name)}&hl=en-IN&gl=IN&ceid=IN:en`;

      let xmlData, parsed;
      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VictoryNewsBot/1.0)' },
          timeout: 10000,
        });
        xmlData = response.data;
        parsed = xmlParser.parse(xmlData);
      } catch (err) {
        console.error(`💥 Fetch/parse failed for ${category.name}:`, err.message);
        continue;
      }

      const items = Array.isArray(parsed?.rss?.channel?.item)
        ? parsed.rss.channel.item
        : (parsed?.rss?.channel?.item ? [parsed.rss.channel.item] : []);

      if (items.length === 0) {
        console.log(`⚠️ No items in RSS for ${category.name}`);
        continue;
      }


      let savedCount = 0;
      for (const item of items) {
        const title = (item.title || '').trim();
        const link = (item.link || '').trim();
        const pubDate = item.pubDate ? new Date(item.pubDate) : null;

        // 🔒 Validate required fields & recency
        if (!title || !link || !pubDate || isNaN(pubDate.getTime())) {
          continue;
        }
        if (pubDate < cutoffTime) {
          continue;
        }

        // ✅ EXTRACT source_url & publisher — WORKS WITH YOUR SAMPLE
        let publisher = 'Google News';
        let sourceUrl = '';

        if (item.source) {
          if (typeof item.source === 'string') {
            publisher = item.source;
          } else if (typeof item.source === 'object') {
            publisher = (item.source['#text'] || 'Unknown').trim();
            sourceUrl = (item.source['@_url'] || '').trim();
          }
        }

        // 🖼️ Extract image and clean description
        let description = (item.description || item['content:encoded'] || '').trim();
        let imageUrl = '';
        const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(item.description || '');
        if (imgMatch) {
          imageUrl = imgMatch[1].trim();
          description = description.replace(/<img[^>]*>/gi, '').trim();
        }

        // 🔗 Resolve final destination URL (avoid Google redirect links)
        let destinationUrl = link;
        try {
          const headResp = await axios.head(link, {
            maxRedirects: 5,
            timeout: 5000,
            validateStatus: () => true,
          });
          destinationUrl = headResp.request.res.responseUrl || link;
        } catch (e) {
          // Keep original link if redirect fails
          console.warn(`🔶 Redirect resolution failed for ${link}`);
        }

        // 🔽 DB Insert with duplicate check
        const query = `
          INSERT INTO news_feed (
            publisher, title, link, publication_date, publish_time,
            brief_description, image_url, source_url, destination_url, news_category
          )
          SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          WHERE NOT EXISTS (
            SELECT 1 FROM news_feed WHERE link = $3
          )
          RETURNING news_id, title;
        `;

        const values = [
          publisher,
          title,
          link,
          pubDate,
          pubDate.toTimeString().substring(0, 8),
          description.substring(0, 5000),
          imageUrl,
          sourceUrl, // ✅ e.g. "https://timesofindia.indiatimes.com"
          destinationUrl,
          category.id,
        ];

        try {
          const result = await pool.query(query, values);
          if (result.rows.length > 0) {
            addedArticles.push(result.rows[0]);
            savedCount++;
          }
        } catch (dbErr) {
          console.error(`💥 DB error for "${title}":`, dbErr.message);
        }
      }

    }
    const endTime = new Date();
    return res.status(200).json({
      success: true,
      message: `Fetched and saved ${addedArticles.length} new article(s).`,
      count: addedArticles.length,
    });

  } catch (err) {
    console.error('💥 Unhandled error in fetchAndSaveNews:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
};
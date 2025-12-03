const { getMarketMovers } = require('../services/marketData/movers.service.js');

async function getTopMovers(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await getMarketMovers(limit);
    res.json(data);
  } catch (error) {
    console.error('Error in getTopMovers controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getTopMovers }

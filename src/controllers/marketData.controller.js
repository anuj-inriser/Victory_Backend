const { asyncHandler } = require('../utils/asyncHandler.js');
const { tsClient } = require('../db/timescaleClient.js');

const getMarketData = asyncHandler(async (req, res) => {
  const { limit = 100, symbol = 'SBIN' } = req.query;
  const parsedLimit = Number(limit) || 100;
  const result = await tsClient.query(
    'SELECT * FROM price_ticks WHERE symbol = $2 ORDER BY ts DESC LIMIT $1',
    [parsedLimit, symbol],
  );
  res.json(result.rows);
});

module.exports = { getMarketData }
const { asyncHandler } = require('../utils/asyncHandler.js');
const { getHistory } = require('../services/marketData/historyAggregation.service.js');

const fetchHistory = asyncHandler(async (req, res) => {
  const { symbol = 'SBIN', range, resolution, limit = 365 } = req.query;
  const data = await getHistory({ symbol, range, resolution, limit });
  res.json(data);
});

module.exports = { fetchHistory }
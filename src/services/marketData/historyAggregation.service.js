const { rangeToFromDate } = require('../../utils/dateRange.js');
const { 
  getDailyCandles, 
  getDailyCandlesWithMarketHours,
  getWeeklyCandlesAggregated,
  getMonthlyCandlesAggregated,
  getIntradayAggregatedCandles 
} = require('../../models/candleOhlc.model.js');
const { getTickAggregatedCandles } = require('../../models/priceTick.model.js');

/**
 * Map TradingView resolution codes to PostgreSQL interval strings
 */
/**
 * Map TradingView resolution codes to PostgreSQL interval strings
 */
function resolutionToInterval(res) {
  const map = {
    '1s': '1 second',
    '1m': '1 minute',
    '5m': '5 minutes',
    '15m': '15 minutes',
    '30m': '30 minutes',
    '1h': '1 hour',
    '2h': '2 hours',
    '4h': '4 hours',
  };
  return map[res] || '1 minute';
}

 async function getHistory({ symbol, range, resolution, limit }) {
  const parsedLimit = Number(limit) || 1000;
  
  // Default to 1D if neither range nor resolution is specified
  let targetResolution = resolution;
  if (!targetResolution) {
    // Legacy support: Map range to resolution
    const upperRange = (range || '1D').toUpperCase();
    if (upperRange === '1D') targetResolution = '1m';
    else if (upperRange === '1W') targetResolution = '1D';
    else if (upperRange === '1M') targetResolution = '1D';
    else targetResolution = '1D';
  }

  let candles;
  
  // Logic:
  // 1. Tick-based resolutions (1s) -> Use getTickAggregatedCandles (uses price_ticks)
  // 2. Intraday resolutions (1m, 5m, 15m, 1h, 4h) -> Use getIntradayAggregatedCandles (uses minute data)
  // 3. Daily+ resolutions (1D, 1W, 1M) -> Use daily/weekly/monthly functions (uses daily data)

  if (targetResolution === '1s') {
    // --- TICK AGGREGATION ---
    // We use raw ticks for 1s resolution
    // Limit to last 24 hours for performance if no range specified
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    candles = await getTickAggregatedCandles({
      symbol,
      from: oneDayAgo,
      interval: '1 second',
      limit: parsedLimit
    });

  } else if (['1m', '5m', '15m', '30m', '1h', '2h', '4h'].includes(targetResolution)) {
    // --- INTRADAY AGGREGATION ---
    // We have minute data for the last 9 months.
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);
    
    candles = await getIntradayAggregatedCandles({
      symbol,
      from: nineMonthsAgo,
      interval: resolutionToInterval(targetResolution),
      limit: parsedLimit
    });
    
  } else {
    // --- DAILY / WEEKLY / MONTHLY ---
    // We have daily data for the last 9 months.
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

    switch (targetResolution) {
      case '1W':
        candles = await getWeeklyCandlesAggregated({ symbol, from: nineMonthsAgo, limit: parsedLimit });
        break;
      case '1M':
        candles = await getMonthlyCandlesAggregated({ symbol, from: nineMonthsAgo, limit: parsedLimit });
        break;
      case '1D':
      default:
        // Daily candles
        candles = await getDailyCandlesWithMarketHours({ symbol, from: nineMonthsAgo, limit: parsedLimit });
        break;
    }
  }
  
  return { symbol, resolution: targetResolution, candles };
}


module.exports = {getHistory};
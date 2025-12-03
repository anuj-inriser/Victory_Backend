/**
 * Returns market hours (09:30 to 15:30 IST) for a given date
 * @param {Date} date - The date to get market hours for
 * @returns {{ start: Date, end: Date }} - Market start and end times
 */
 function getMarketHoursForDate(date) {
  const start = new Date(date);
  start.setHours(9, 30, 0, 0);
  
  const end = new Date(date);
  end.setHours(15, 30, 0, 0);
  
  return { start, end };
}

/**
 * Returns today's market hours
 * @returns {{ start: Date, end: Date }} - Today's market start and end times
 */
 function getTodayMarketHours() {
  return getMarketHoursForDate(new Date());
}

/**
 * Converts a range string to a from date
 * @param {string} range - Range string (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
 * @returns {Date|null} - From date or null for ALL
 */
 function rangeToFromDate(range) {
  const now = new Date();
  switch (range) {
    case '1D':
      return new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    case '1W':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1M':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3M':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '6M':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    case '1Y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return null; // ALL
  }
}


module.exports = {getMarketHoursForDate,getTodayMarketHours,rangeToFromDate}

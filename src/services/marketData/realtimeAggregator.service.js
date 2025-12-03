const { insertCandle } = require('../../models/candleOhlc.model.js');
const { logger } = require('../../config/logger.js');

class RealtimeAggregatorService {
  constructor() {
    // Map<symbol, { startTime: number, open, high, low, close, volume }>
    this.activeCandles = new Map();
    
    // Periodic flush timer to save candles even if no new ticks arrive
    this.flushInterval = setInterval(() => {
      this.flushOldCandles();
    }, 60000); // Check every minute
  }

  /**
   * Process a new tick and aggregate into 1-minute candles
   * @param {string} symbol 
   * @param {number} price 
   * @param {number} volume (optional, incremental volume)
   * @param {Date} ts 
   */
  async onTick(symbol, price, volume = 0, ts = new Date()) {
    const timestamp = ts.getTime();
    // Calculate start of the minute for this tick
    const minuteStart = Math.floor(timestamp / 60000) * 60000;

    let candle = this.activeCandles.get(symbol);

    // If we have a candle but it belongs to a previous minute, flush it
    if (candle && candle.startTime < minuteStart) {
      await this.flushCandle(symbol, candle);
      candle = null; // Force creation of new candle
    }

    // Initialize new candle if needed
    if (!candle) {
      candle = {
        startTime: minuteStart,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: volume
      };
      this.activeCandles.set(symbol, candle);
    } else {
      // Update existing candle
      candle.high = Math.max(candle.high, price);
      candle.low = Math.min(candle.low, price);
      candle.close = price;
      candle.volume += volume;
    }
  }

  async flushCandle(symbol, candle) {
    try {
      const ts = new Date(candle.startTime);
      
      // Log for debugging
      // logger.info(`[Aggregator] Flushing 1m candle for ${symbol} at ${ts.toISOString()}`);

      await insertCandle({
        symbol,
        ts,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      });
    } catch (err) {
      // Ignore duplicate key errors (if we somehow processed this minute already)
      if (err.code !== '23505') {
        logger.error(`[Aggregator] Failed to flush candle for ${symbol}: ${err.message}`);
      }
    }
  }

  /**
   * Flush all candles that are older than the current minute
   * This ensures candles get saved even if no new ticks arrive
   */
  async flushOldCandles() {
    const now = Date.now();
    const currentMinuteStart = Math.floor(now / 60000) * 60000;
    
    const promises = [];
    
    for (const [symbol, candle] of this.activeCandles.entries()) {
      // If candle is from a previous minute, flush it
      if (candle.startTime < currentMinuteStart) {
        promises.push(this.flushCandle(symbol, candle));
        this.activeCandles.delete(symbol);
      }
    }
    
    if (promises.length > 0) {
      await Promise.all(promises);
      logger.info(`[Aggregator] Flushed ${promises.length} old candles`);
    }
  }
}

 const realtimeAggregatorService = new RealtimeAggregatorService();

 module.exports = {realtimeAggregatorService};

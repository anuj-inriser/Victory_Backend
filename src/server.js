const { createServer } = require('http');
const { createApp } = require('./app.js');
const { env } = require('./config/env.js');
const { logger } = require('./config/logger.js');
const { initRedis } = require('./db/redisClient.js');
const { initTimescale } = require('./db/timescaleClient.js');
const { angelWebSocketServiceV2 } = require('./services/marketData/angelWebSocket.service.v2.js');
const { populateRedisFromDB } = require('./services/marketData/movers.service.js');
const { attachPriceSocket, broadcastPrice } = require('./sockets/index.js');

async function startServer() {
  await initTimescale();
  await initRedis();

  const app = createApp();
  const server = createServer(app);

  attachPriceSocket(server);

  // Initialize Angel One WebSocket for live data (using custom implementation)
  angelWebSocketServiceV2.init(broadcastPrice);

  server.listen(env.port, () => {
    logger.info(`Backend v2 listening on http://localhost:${env.port}`);

    // Populate Redis in background (non-blocking)
    logger.info('[Server] Initializing Redis cache for market movers in background...');
    populateRedisFromDB().catch(err => {
      logger.error('[Server] Failed to populate Redis:', err);
    });
  });
}

module.exports = { startServer }

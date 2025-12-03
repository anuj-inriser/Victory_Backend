const { asyncHandler } = require('../utils/asyncHandler.js');
const { angelWebSocketService } = require('../services/marketData/angelWebSocket.service.js');

const getWebSocketStatus = asyncHandler(async (req, res) => {
  res.json({
    isConnected: angelWebSocketService.isConnected,
    ticksReceived: angelWebSocketService.tickCount,
    lastTickTime: angelWebSocketService.lastTickTime,
    message: angelWebSocketService.isConnected
      ? `WebSocket connected. Received ${angelWebSocketService.tickCount} ticks.`
      : 'WebSocket is NOT connected. Check your tokens in .env file'
  });
});

module.exports = { getWebSocketStatus }

const { insertRandomTick } = require('../../models/priceTick.model.js');
const { logger } = require('../../config/logger.js');

const SIM_SYMBOLS = ['SBIN', 'INFY', 'TCS'];

 function startSimulatedTicks(priceWss) {
  let idx = 0;
  setInterval(async () => {
    try {
      const symbol = SIM_SYMBOLS[idx % SIM_SYMBOLS.length];
      idx += 1;
      const point = await insertRandomTick(symbol);
      const payload = JSON.stringify({
        type: 'price',
        data: { symbol, ts: point.ts, value: point.value },
      });
      priceWss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(payload);
      });
    } catch (err) {
      logger.error('Simulated tick error:', err.message);
    }
  }, 1000);
}

module.exports = {startSimulatedTicks}

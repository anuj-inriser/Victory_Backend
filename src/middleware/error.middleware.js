const { logger } = require('../config/logger.js');

function errorHandler1(err, req, res, next) {
  logger.error(err.stack || err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = { errorHandler1 }

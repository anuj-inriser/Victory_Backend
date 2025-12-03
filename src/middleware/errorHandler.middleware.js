// middleware/errorHandler.middleware.js
const AppError = require("../utils/appError"); // if you have AppError

function errorHandler(err, req, res, next) {

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = errorHandler; //  export function directly

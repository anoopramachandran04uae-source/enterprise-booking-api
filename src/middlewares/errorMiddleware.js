const env = require("../config/env");

const errorMiddleware = (err, req, res) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
  }

  res.status(statusCode).json({
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message,
    ...(env.nodeEnv === "development" && {
      stack: err.stack,
    }),
  });
};

module.exports = errorMiddleware;

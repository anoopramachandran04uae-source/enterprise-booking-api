const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);

    res.status(429).json({
      status: "fail",
      message: "Too many attempts. Please try again later.",
    });
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    logger.warn(`API rate limit exceeded for IP: ${req.ip}`);

    res.status(429).json({
      status: "fail",
      message: "Too many requests. Please try again later.",
    });
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};

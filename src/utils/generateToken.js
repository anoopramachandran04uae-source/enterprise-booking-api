const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn || "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn || "7d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

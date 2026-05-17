const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized. Token missing", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtAccessSecret);

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError("User no longer exists or inactive", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return next(new AppError("Invalid or expired token", 401));
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }

    next();
  };
};

module.exports = {
  protect,
  allowRoles,
};

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const emailQueue = require("../jobs/emailQueue");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError("Email already registered", 409));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    await emailQueue.add("welcomeEmail", {
      email: user.email,
      name: user.name,
    });

    console.log("Email job added to queue");

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      accessToken,
      refreshToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      refreshToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 401));
    }

    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);

    const hashedRefreshToken = hashToken(refreshToken);

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: hashedRefreshToken,
    }).select("+refreshToken");

    if (!user) {
      return next(new AppError("Invalid refresh token", 401));
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = hashToken(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Invalid or expired refresh token", 401));
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 400));
    }

    const hashedRefreshToken = hashToken(refreshToken);

    await User.findOneAndUpdate(
      { refreshToken: hashedRefreshToken },
      { refreshToken: null },
    );

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  profile,
};

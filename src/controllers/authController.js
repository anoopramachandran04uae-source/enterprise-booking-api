const User = require("../models/User");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError("Email already registered", 409));
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user
    }
  });
};

module.exports = {
  register,
  login,
  profile
};
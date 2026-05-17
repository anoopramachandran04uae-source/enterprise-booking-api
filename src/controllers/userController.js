const User = require("../models/User");
const AppError = require("../utils/AppError");
const { redisClient } = require("../config/redis");

const list = async (req, res, next) => {
  try {
    const cacheKey = "users:list";

    const cachedUsers = await redisClient.get(cacheKey);

    if (cachedUsers) {
      return res.status(200).json({
        status: "success",
        message: "Success from cache",
        data: JSON.parse(cachedUsers),
      });
    }

    const users = await User.find();

    if (users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    await redisClient.setEx(cacheKey, 60, JSON.stringify(formattedUsers));

    res.status(200).json({
      status: "success",
      message: "Success from database",
      data: {
        users: formattedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
};

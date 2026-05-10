const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
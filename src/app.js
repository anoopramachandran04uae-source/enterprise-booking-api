const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const AppError = require("./utils/AppError");
const { apiLimiter } = require("./middlewares/rateLimitMiddleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use(hpp());
app.use(compression());

app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);

module.exports = app;

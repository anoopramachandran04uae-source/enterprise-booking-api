const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const logger = require("./config/logger");

const { connectRedis } = require("./config/redis");

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

connectRedis();
connectDB();

require("./workers/emailWorker");

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});

process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);

  server.close(() => {
    process.exit(1);
  });
});

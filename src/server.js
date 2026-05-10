const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

connectDB();

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);

  server.close(() => {
    process.exit(1);
  });
});
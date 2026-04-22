import app from "./app";
import connectDatabase from "./config/database";
import env from "./config/env";
import logger from "./config/logger";

let server: ReturnType<typeof app.listen> | undefined;

const shutdown = (signal: string, code = 0) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  if (!server) process.exit(code);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(code);
  });
};

const startServer = async () => {
  await connectDatabase();

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode.`);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection", error);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  shutdown("uncaughtException", 1);
});

void startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});

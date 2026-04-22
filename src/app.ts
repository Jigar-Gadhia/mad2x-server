import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env";
import logger from "./config/logger";
import { registerSwagger } from "./docs/swagger";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { apiRouter } from "./routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",").map((value) => value.trim()),
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(
  morgan("dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy - v2" });
});

registerSwagger(app);
app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;

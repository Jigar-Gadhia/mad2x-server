import * as dotenv from "dotenv";

dotenv.config();

const requiredKeys = ["MONGO_URI", "JWT_SECRET"] as const;
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
}

const env = {
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET as string),
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  swaggerEnabled:
    process.env.ENABLE_SWAGGER !== undefined
      ? process.env.ENABLE_SWAGGER === "true"
      : process.env.NODE_ENV !== "production",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
};

export default env;

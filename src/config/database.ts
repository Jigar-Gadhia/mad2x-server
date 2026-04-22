import mongoose from "mongoose";
import env from "./env";
import logger from "./logger";

const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected.");
};

export default connectDatabase;

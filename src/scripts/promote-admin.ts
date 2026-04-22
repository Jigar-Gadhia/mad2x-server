import mongoose from "mongoose";
import connectDatabase from "../config/database";
import logger from "../config/logger";
import UserModel from "../models/user.model";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  logger.error("Usage: npm run admin:promote -- user@example.com");
  process.exit(1);
}

const run = async () => {
  await connectDatabase();

  const user = await UserModel.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
  if (!user) {
    logger.error(`User not found for email ${email}`);
    process.exit(1);
  }

  logger.info(`User ${email} promoted to admin successfully.`);
};

void run()
  .catch((error) => {
    logger.error("Failed to promote admin", error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

import multer from "multer";
import { AppError } from "../utils/app-error.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new AppError("Only image uploads are allowed.", 400)),
});

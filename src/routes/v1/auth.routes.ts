import { Router } from "express";
import * as controller from "../../controllers/auth.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  forgotPasswordSchema,
  refreshSessionSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateProfileSchema,
} from "../../schemas/auth.schema.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(controller.signup));
router.post("/signin", validate(signinSchema), asyncHandler(controller.signin));
router.post("/refresh", validate(refreshSessionSchema), asyncHandler(controller.refreshSession));
router.post("/logout", validate(refreshSessionSchema), asyncHandler(controller.logout));
router.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(controller.forgotPassword));
router.post("/reset-password/:token", validate(resetPasswordSchema), asyncHandler(controller.resetPassword));
router.get("/profile", auth, asyncHandler(controller.profile));
router.patch(
  "/profile",
  auth,
  upload.single("profilePic"),
  validate(updateProfileSchema),
  asyncHandler(controller.updateProfile)
);

export default router;


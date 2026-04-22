import { Router } from "express";
import * as controller from "../../controllers/doctor.controller.js";
import { auth, requireAdmin } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  doctorParamsSchema,
  doctorQuerySchema,
  updateDoctorSchema,
} from "../../schemas/doctor.schema.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/", auth, requireAdmin, validate(createDoctorSchema), asyncHandler(controller.createDoctor));
router.get("/", validate(doctorQuerySchema), asyncHandler(controller.listDoctors));
router.get("/:id", validate(doctorParamsSchema), asyncHandler(controller.doctorDetail));
router.patch("/:id", auth, requireAdmin, validate(updateDoctorSchema), asyncHandler(controller.updateDoctor));
router.delete("/:id", auth, requireAdmin, validate(doctorParamsSchema), asyncHandler(controller.deleteDoctor));

export default router;

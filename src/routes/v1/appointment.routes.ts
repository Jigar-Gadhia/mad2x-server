import { Router } from "express";
import * as controller from "../../controllers/appointment.controller";
import { auth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  appointmentParamsSchema,
  appointmentQuerySchema,
  createAppointmentSchema,
} from "../../schemas/appointment.schema";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

router.post("/", auth, validate(createAppointmentSchema), asyncHandler(controller.createAppointment));
router.get("/mine", auth, validate(appointmentQuerySchema), asyncHandler(controller.getMyAppointments));
router.patch("/:id/cancel", auth, validate(appointmentParamsSchema), asyncHandler(controller.cancelAppointment));

export default router;

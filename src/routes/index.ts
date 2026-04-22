import { Router } from "express";
import appointmentRoutes from "./v1/appointment.routes";
import authRoutes from "./v1/auth.routes";
import doctorRoutes from "./v1/doctor.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/doctors", doctorRoutes);
apiRouter.use("/appointments", appointmentRoutes);

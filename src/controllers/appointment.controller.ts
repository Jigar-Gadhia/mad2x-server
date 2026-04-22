import type { Request, Response } from "express";
import { messages } from "../constants/messages";
import type { AppointmentQueryInput, CreateAppointmentInput } from "../schemas/appointment.schema";
import { appointmentService } from "../services/appointment.service";
import { success } from "../utils/api-response";

export const createAppointment = async (req: Request, res: Response) =>
  success(
    res,
    await appointmentService.createAppointment(req.user!.id, req.body as CreateAppointmentInput),
    messages.appointment.created,
    201
  );

export const getMyAppointments = async (req: Request, res: Response) =>
  success(
    res,
    await appointmentService.getMyAppointments(req.user!.id, req.query as AppointmentQueryInput),
    messages.appointment.fetched
  );

export const cancelAppointment = async (req: Request, res: Response) =>
  success(
    res,
    await appointmentService.cancelAppointment(req.user!.id, req.params.id as string),
    messages.appointment.cancelled
  );

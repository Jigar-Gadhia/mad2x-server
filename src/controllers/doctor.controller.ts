import type { Request, Response } from "express";
import { messages } from "../constants/messages";
import type { CreateDoctorInput, UpdateDoctorInput } from "../schemas/doctor.schema";
import { doctorService } from "../services/doctor.service";
import { success } from "../utils/api-response";

export const listDoctors = async (req: Request, res: Response) =>
  success(res, await doctorService.getDoctors(req.query), messages.doctor.fetched);

export const doctorDetail = async (req: Request, res: Response) =>
  success(res, await doctorService.getDoctorById(req.params.id as string), messages.doctor.detailFetched);

export const createDoctor = async (req: Request, res: Response) =>
  success(res, await doctorService.createDoctor(req.body as CreateDoctorInput), messages.doctor.created, 201);

export const updateDoctor = async (req: Request, res: Response) =>
  success(
    res,
    await doctorService.updateDoctor(req.params.id as string, req.body as UpdateDoctorInput),
    messages.doctor.updated
  );

export const deleteDoctor = async (req: Request, res: Response) => {
  await doctorService.deleteDoctor(req.params.id as string);
  return success(res, null, messages.doctor.deleted);
};

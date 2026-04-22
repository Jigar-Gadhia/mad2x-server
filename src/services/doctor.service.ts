import DoctorModel from "../models/doctor.model";
import { messages } from "../constants/messages";
import type { CreateDoctorInput, UpdateDoctorInput } from "../schemas/doctor.schema";
import { AppError } from "../utils/app-error";
import { getPagination } from "../utils/pagination";

type DoctorQuery = {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  speciality?: unknown;
  hospital?: unknown;
  location?: unknown;
  available?: unknown;
  sortBy?: unknown;
  order?: unknown;
};

const getDoctors = async (query: DoctorQuery) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    ...(query.search
      ? {
          $or: [
            { doctorName: { $regex: query.search, $options: "i" } },
            { specialityName: { $regex: query.search, $options: "i" } },
            { hospital: { $regex: query.search, $options: "i" } },
          ],
        }
      : {}),
    ...(query.speciality ? { specialityName: { $regex: query.speciality, $options: "i" } } : {}),
    ...(query.hospital ? { hospital: { $regex: query.hospital, $options: "i" } } : {}),
    ...(query.location ? { location: { $regex: query.location, $options: "i" } } : {}),
    ...(query.available !== undefined ? { available: query.available } : {}),
  };
  const sortField = typeof query.sortBy === "string" ? query.sortBy : "doctorName";
  const sortOrder = query.order === "desc" ? -1 : 1;
  const [items, total] = await Promise.all([
    DoctorModel.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    DoctorModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getDoctorById = async (id: string) => {
  const doctor = await DoctorModel.findById(id);
  if (!doctor) throw new AppError(messages.doctor.notFound, 404);
  return doctor;
};

const createDoctor = async (payload: CreateDoctorInput) => DoctorModel.create(payload);

const updateDoctor = async (id: string, payload: UpdateDoctorInput) => {
  const doctor = await DoctorModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!doctor) throw new AppError(messages.doctor.notFound, 404);
  return doctor;
};

const deleteDoctor = async (id: string) => {
  const doctor = await DoctorModel.findByIdAndDelete(id);
  if (!doctor) throw new AppError(messages.doctor.notFound, 404);
};

export const doctorService = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};

export { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };

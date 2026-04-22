import AppointmentModel from "../models/appointment.model";
import DoctorModel from "../models/doctor.model";
import { messages } from "../constants/messages";
import type { AppointmentQueryInput, CreateAppointmentInput } from "../schemas/appointment.schema";
import { AppError } from "../utils/app-error";

const createAppointment = async (userId: string, payload: CreateAppointmentInput) => {
  const doctor = await DoctorModel.findById(payload.doctorId);
  if (!doctor) throw new AppError(messages.doctor.notFound, 404);
  if (!doctor.available) throw new AppError(messages.doctorStatus.unavailable, 409);

  let appointment;
  try {
    appointment = await AppointmentModel.create({
      user: userId,
      doctor: payload.doctorId,
      appointmentDate: payload.appointmentDate,
      notes: payload.notes,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(messages.appointment.conflict, 409);
    }

    throw error;
  }

  return appointment.populate("doctor", "doctorName specialityName hospital location consultationFee");
};

const getMyAppointments = async (userId: string, query: AppointmentQueryInput) =>
  AppointmentModel.find({
    user: userId,
    ...(query.status ? { status: query.status } : {}),
  })
    .populate("doctor", "doctorName specialityName hospital location consultationFee")
    .sort({ appointmentDate: 1 });

const cancelAppointment = async (userId: string, appointmentId: string) => {
  const appointment = await AppointmentModel.findOne({ _id: appointmentId, user: userId }).populate(
    "doctor",
    "doctorName specialityName hospital location consultationFee"
  );

  if (!appointment) throw new AppError(messages.appointment.notFound, 404);
  if (appointment.status === "cancelled") throw new AppError(messages.appointment.alreadyCancelled, 400);

  appointment.status = "cancelled";
  await appointment.save();

  return appointment;
};

export const appointmentService = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
};

export { createAppointment, getMyAppointments, cancelAppointment };

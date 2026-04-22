import { Schema, model, type InferSchemaType } from "mongoose";

const appointmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    appointmentDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
      index: true,
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1 },
  { unique: true, partialFilterExpression: { status: "scheduled" } }
);

appointmentSchema.index(
  { user: 1, appointmentDate: 1 },
  { unique: true, partialFilterExpression: { status: "scheduled" } }
);

export type Appointment = InferSchemaType<typeof appointmentSchema>;
export default model("Appointment", appointmentSchema);

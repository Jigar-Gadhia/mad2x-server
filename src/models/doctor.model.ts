import { Schema, model, type InferSchemaType } from "mongoose";

const doctorSchema = new Schema(
  {
    doctorName: { type: String, trim: true },
    specialityName: { type: String, trim: true },
    hospital: { type: String, trim: true },
    about: { type: String, trim: true },
    patients: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    location: { type: String, trim: true },
    available: { type: Boolean, default: true },
  },
  {
    collection: "doc_list",
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

export type Doctor = InferSchemaType<typeof doctorSchema>;
export default model("Doctor", doctorSchema);

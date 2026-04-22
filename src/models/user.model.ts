import { Schema, model, type InferSchemaType } from "mongoose";

const profilePictureSchema = new Schema(
  {
    data: Buffer,
    contentType: String,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    mobile: { type: String, trim: true },
    age: { type: Number, min: 0 },
    address: { type: String, trim: true },
    profilePic: profilePictureSchema,
    resetToken: String,
    resetTokenExpiry: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.resetToken;
        delete ret.resetTokenExpiry;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

export type User = InferSchemaType<typeof userSchema>;
export default model("User", userSchema);

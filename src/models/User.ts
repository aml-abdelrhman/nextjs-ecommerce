import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatarUrl?: string;
  role?: "user" | "admin";
}

const userSchema = new Schema<User>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    avatarUrl: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>("User", userSchema);

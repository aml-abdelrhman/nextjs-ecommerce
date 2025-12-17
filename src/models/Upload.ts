import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  userId: string;
  fileName: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Upload || mongoose.model<IUpload>("Upload", UploadSchema);

import mongoose, { Schema, Document, model } from "mongoose";

export interface NotificationDocument extends Document {
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

export default mongoose.models.Notification || model<NotificationDocument>("Notification", NotificationSchema);

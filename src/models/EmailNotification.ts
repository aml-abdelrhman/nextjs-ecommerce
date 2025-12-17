import { Schema, model, models } from "mongoose";

interface EmailNotificationDoc {
  message: string;
  type: string; 
  read: boolean;
  createdAt: Date;
  userRole: string; 
}

const emailNotificationSchema = new Schema<EmailNotificationDoc>({
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userRole: { type: String, required: true },
});

const EmailNotification = models.EmailNotification || model("EmailNotification", emailNotificationSchema);
export default EmailNotification;

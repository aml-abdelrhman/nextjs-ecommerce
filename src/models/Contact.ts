import  { Schema, Document, model, models } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
});

const Contact = models.Contact || model<IContact>("Contact", contactSchema);
export default Contact;

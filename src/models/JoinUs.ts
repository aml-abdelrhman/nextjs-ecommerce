import  { Schema, Document, model, models } from "mongoose";

export interface IJoinUs extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

const joinUsSchema = new Schema<IJoinUs>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const JoinUs = models.JoinUs || model<IJoinUs>("JoinUs", joinUsSchema);
export default JoinUs;

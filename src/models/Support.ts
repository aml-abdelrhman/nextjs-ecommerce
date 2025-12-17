import  { Schema, model, models } from "mongoose";

const supportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Support = models.Support || model("Support", supportSchema);

export default Support;

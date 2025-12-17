
import { Schema, model, models, Types } from "mongoose";

export interface AddressDoc {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<AddressDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = models.Address || model<AddressDoc>("Address", addressSchema);
export default Address;

import { Schema, model, models } from "mongoose";

interface IPaymentMethod {
  userId: string;          
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  default?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    userId: { type: String, required: true, index: true },
    cardNumber: { type: String, required: true },
    cardHolder: { type: String, required: true },
    expiry: { type: String, required: true },
    default: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PaymentMethod = models.PaymentMethod || model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;

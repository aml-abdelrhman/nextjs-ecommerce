import mongoose from "mongoose";

export const ORDER_STATUSES = [
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, 

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "processing",
    },

    total: Number,

    address: {
      fullName: String,
      phone: String,
      city: String,
      street: String,
    },

    paymentMethod: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

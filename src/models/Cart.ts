import { Schema, model, models } from "mongoose";
import { CartDocument } from "@/types/cart";

const CartItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    qty: { type: Number, required: true, default: 1 },
  },
  { _id: false } 
);

const CartSchema = new Schema<CartDocument>(
  {
    userId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const Cart = models.Cart || model<CartDocument>("Cart", CartSchema);

export default Cart;

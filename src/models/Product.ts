// src/models/Product.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  rating?: number;
  category?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
 discountPercentage?: number;
  stock?: number;
  brand?: string;
  thumbnail: string;
  images?: string[];
}

export interface ProductsResponse {
  data: IProduct[];
  total: number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
     discountPercentage: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    brand: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

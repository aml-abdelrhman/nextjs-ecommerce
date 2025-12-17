
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlistItem extends Document {
  userId: string;
  productId: string;
  title: string;
  price?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlistItem>({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number },
  image: { type: String },
}, { timestamps: true });

const Wishlist: Model<IWishlistItem> = mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;

export interface WishlistItem {
  id: string;
  title: string;
  price?: number;
  image?: string;
  rating?: number;
  discount?: number;
}

export interface WishlistData {
  userId: string;
  items: WishlistItem[];
}

export interface WishlistDocument extends Document {
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

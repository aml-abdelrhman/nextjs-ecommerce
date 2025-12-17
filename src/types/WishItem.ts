export interface WishItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  rating?: number;
  discount?: number;
}

export interface WishData {
  userId: string;
  items: WishItem[];
}

export interface WishDocument extends Document {
  userId: string;
  items: WishItem[];
  createdAt: Date;
  updatedAt: Date;
}

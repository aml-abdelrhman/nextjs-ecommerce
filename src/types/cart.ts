export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  discount?: number;
  rating?: number;
  image?: string;
}

export interface CartData {
  userId: string;
  items: CartItem[];
}

export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CheckoutOrder {
  items: CheckoutItem[];
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  userEmail?: string;
  createdAt?: string;
}

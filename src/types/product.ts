export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail: string;
  images?: string[];
  tags?: string[]; 
  tag?: string[]; 
}

export interface ProductsResponse {
  data: Product[];
  total: number;
}

export type Params = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
};

import { useQuery } from "@tanstack/react-query";
import type { ProductsResponse } from "@/types/product";

export type Params = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
};

const buildQuery = (params: Params) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.q) query.append("q", params.q);
  if (params.category) query.append("category", params.category);
  if (params.sort) query.append("sort", params.sort);
  if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
  return query.toString();
};

export const useProducts = (params: Params) => {
  const url = `/api/products?${buildQuery(params)}`; 

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return {
        data: data.data,
        total: data.total,
      } as ProductsResponse;
    },
  });
};

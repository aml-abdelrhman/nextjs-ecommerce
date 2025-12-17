import axios from "axios";
import { IProduct } from "@/types/product";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

export async function getProducts({
  page = 1,
  limit = 12,
  q = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
}) {
  const skip = (page - 1) * limit;
  if (q && !category) {
    const { data } = await api.get("/products/search", { params: { q, limit, skip } });
    return { data: data.products as IProduct[], total: data.total };
  }
  const endpoint = category ? `/products/category/${encodeURIComponent(category)}` : "/products";
  const { data } = await api.get(endpoint, { params: { limit, skip } });
  return { data: data.products as IProduct[], total: data.total };
}

export async function getProduct(id: number) {
  const { data } = await api.get(`/products/${id}`);
  return data as IProduct;
}

export default api;

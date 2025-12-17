import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/models/Product";

export const useProduct = (id: string) => {
  return useQuery<IProduct, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return (await res.json()) as IProduct;
    },
  });
};

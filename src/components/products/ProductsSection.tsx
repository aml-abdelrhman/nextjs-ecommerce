"use client";
import React from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import "@/styles/products/ProductsPagge.scss";
import "@/styles/products/Card.scss";
import { Product } from "@/types/product";

type Props = {
  type: "new" | "bestseller" | "featured";
  limit?: number;
};

const ProductsSection = ({ type, limit = 4 }: Props) => {
  const { data, isLoading, error } = useProducts({ limit: 100 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">Failed to load products.</p>;

  let products: Product[] = data?.data || [];

  if (type === "new") {
    products = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }

  if (type === "bestseller") {
    products = [...products]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);
  }

  if (type === "featured") {
    products = products
      .filter((p) => (p.discountPercentage ?? 0) >= 10)
      .slice(0, limit);
  }

  return (
    <div className="productsSection">
      <h2>
        {type === "new" && "New Products"}
        {type === "bestseller" && "Best Seller"}
        {type === "featured" && "Featured"}
      </h2>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;

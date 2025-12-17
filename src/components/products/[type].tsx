"use client";
import React from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import "@/styles/products/ProductsPagge.scss"; 

type Props = {
  params: {
    type: string; // "new", "bestseller", "featured"
  };
};

const ProductsPage = ({ params }: Props) => {
  let category: string | undefined;
  let sort: string | undefined;

  switch (params.type) {
    case "new":
      sort = "createdAt";
      break;
    case "bestseller":
      sort = "sales";
      break;
    case "featured":
      category = "featured";
      break;
  }

  const { data, isLoading, error } = useProducts({ limit: 20, sort, category });

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Failed to load products.</p>;

  return (
    <div className="productsPage">
      <h1>{params.type.replace("-", " ")}</h1>
      <div className="grid">
        {data?.data.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;

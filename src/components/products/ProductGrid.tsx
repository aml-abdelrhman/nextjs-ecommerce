"use client";
import React, { useEffect } from "react";
import { useProductsContext } from "./ProductsContext";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import Pagination from "./Pagination";
import { Product } from "@/types/product";
import styles from "@/styles/products/Grid.module.scss";

export default function ProductGrid() {
  const {
    page,
    limit,
    debouncedSearch,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
    setTotalResults,
  } = useProductsContext();

  const { data, isLoading, isError } = useProducts({
    page,
    limit,
    q: debouncedSearch,
    category: selectedCategory,
    sort,
    minPrice,
    maxPrice,
  });

  useEffect(() => {
    if (data?.total !== undefined) setTotalResults(data.total);
  }, [data, setTotalResults]);

  if (isError) return <div className={styles.error}>Something went wrong.</div>;

  return (
    <>
      {isLoading ? (
        <ProductSkeleton count={limit} />
      ) : data?.data.length ? (
        <>
          <div className={styles.grid}>
            {data.data.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination />
        </>
      ) : (
        <div className={styles.empty}>No products found.</div>
      )}
    </>
  );
}

"use client";
import React from "react";
import { ProductsProvider } from "@/components/products/ProductsContext";
import ProductsContent from "@/components/products/ProductsContent";
import "@/styles/products/ProductsPage.scss";

export default function ProductsPage() {
  return (
    <ProductsProvider>
      <div className="products-page">
        <h1 className="products-page__title">Our Products</h1>
        <ProductsContent />
      </div>
    </ProductsProvider>
  );
}

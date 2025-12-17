"use client";
import React from "react";
import FiltersBar from "./FiltersBar";
import ProductGrid from "./ProductGrid";
import { ProductsProvider } from "@/components/products/ProductsContext";
import "@/styles/products/ProductsContent.scss";

export default function ProductsContent() {
  return (
    <ProductsProvider >
    <div className="products-content">
      <FiltersBar />
      <ProductGrid /> 
    </div>
   </ProductsProvider>

  );
}

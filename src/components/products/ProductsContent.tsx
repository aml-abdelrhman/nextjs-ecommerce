"use client";

import React from "react";
import dynamic from "next/dynamic";
import ProductGrid from "./ProductGrid";
import { ProductsProvider } from "@/components/products/ProductsContext";
import "@/styles/products/ProductsContent.scss";


const FiltersBar = dynamic(() => import("./FiltersBar"), { ssr: false });

export default function ProductsContent() {
  return (
    <ProductsProvider>
      <div className="products-content">
        <FiltersBar />
        <ProductGrid />
      </div>
    </ProductsProvider>
  );
}

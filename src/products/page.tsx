"use client";

import React from "react";
import ProductsContent from "@/components/products/ProductsContent";

export default function ProductsHome() {
  return (
      <section className="w-full px-4 py-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Our  Products</h2>

        <ProductsContent />
      </section>
  );
}

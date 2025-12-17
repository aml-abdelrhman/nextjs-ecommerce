"use client";

import ProductDetails from "@/components/products/ProductDetails";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails id={params.id} />;
}

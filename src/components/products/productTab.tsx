"use client";
import React, { useState } from "react";
import ProductsSection from "./ProductsSection";
import "@/styles/products/ProductTabs.scss";

type TabType = "new" | "bestseller" | "featured";

const tabs: TabType[] = ["new", "bestseller", "featured"];

const tabLabels: Record<TabType, string> = {
  new: "New Arrival",
  bestseller: "Best Seller",
  featured: "Featured",
};

const ProductTabs = () => {
  const [active, setActive] = useState<TabType>("new");

  return (
    <div className="productTabs">
      <div className="tabs">
        {tabs.map((type) => (
          <button
            key={type}
            className={`tab ${active === type ? "active" : ""}`}
            onClick={() => setActive(type)}
          >
            <div className="circle" />
            <span>{tabLabels[type]}</span>
          </button>
        ))}
      </div>

      <ProductsSection type={active} limit={4} />
    </div>
  );
};

export default ProductTabs;

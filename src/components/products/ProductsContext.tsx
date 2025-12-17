"use client";
import React, { createContext, useContext, useState } from "react";

interface ProductsContextType {
  page: number;
  limit: number;
  search: string;
  debouncedSearch: string;
  selectedCategory: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
  totalResults: number;

  setPage: (v: number) => void;
  setLimit: (v: number) => void;
  setSearch: (v: string) => void;
  setDebouncedSearch: (v: string) => void;
  setSelectedCategory: (v: string) => void;
  setSort: (v: string) => void;
  setMinPrice: (v: number) => void;
  setMaxPrice: (v: number) => void;
  setTotalResults: (v: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  return (
    <ProductsContext.Provider
      value={{
        page,
        limit,
        search,
        debouncedSearch,
        selectedCategory,
        sort,
        minPrice,
        maxPrice,
        totalResults,

        setPage,
        setLimit,
        setSearch,
        setDebouncedSearch,
        setSelectedCategory,
        setSort,
        setMinPrice,
        setMaxPrice,
        setTotalResults,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsContext must be used within ProductsProvider");
  return ctx;
};

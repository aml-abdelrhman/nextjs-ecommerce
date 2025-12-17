"use client";
import React, { useEffect } from "react";
import { useProductsContext } from "./ProductsContext";
import { useSearchParams } from "next/navigation"; 
import "@/styles/products/Filterbar.scss";

interface FilterChanges {
  search?: string;
  selectedCategory?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default function FiltersBar() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const {
    search,
    setSearch,
    setDebouncedSearch,
    selectedCategory,
    setSelectedCategory,
    sort,
    setSort,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setPage,
    totalResults,
  } = useProductsContext();

  useEffect(() => {
    if (queryFromUrl) {
      setSearch(queryFromUrl);
    }
  }, [queryFromUrl, setSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, setDebouncedSearch]);

  const handleChange = (changes: FilterChanges) => {
    if (changes.search !== undefined) setSearch(changes.search);
    if (changes.selectedCategory !== undefined) setSelectedCategory(changes.selectedCategory);
    if (changes.sort !== undefined) setSort(changes.sort);
    if (changes.minPrice !== undefined) setMinPrice(changes.minPrice);
    if (changes.maxPrice !== undefined) setMaxPrice(changes.maxPrice);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSort("");
    setMinPrice(0);
    setMaxPrice(0);
    setPage(1);
  };

  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          value={search}
          placeholder="Search products..."
          onChange={(e) => handleChange({ search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleChange({ selectedCategory: e.target.value })}
        >
          <option value="">All</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="fragrances">Fragrances</option>
          <option value="beauty">Makeup</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort</label>
        <select value={sort} onChange={(e) => handleChange({ sort: e.target.value })}>
          <option value="">Default</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating_desc">Rating ↓</option>
          <option value="name_asc">Name A→Z</option>
          <option value="name_desc">Name Z→A</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Min Price</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => handleChange({ minPrice: Number(e.target.value) })}
        />
      </div>

      <div className="filter-group">
        <label>Max Price</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => handleChange({ maxPrice: Number(e.target.value) })}
        />
      </div>

      <div className="total-results">
        Showing {totalResults} product{totalResults !== 1 ? "s" : ""}
      </div>

      <button className="reset-btn" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
}

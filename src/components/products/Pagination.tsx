"use client";
import React from "react";
import { useProductsContext } from "./ProductsContext";
import "@/styles/products/Pagination.scss";

export default function Pagination() {
  const { page, setPage, limit, totalResults } = useProductsContext();
  const totalPages = Math.ceil(totalResults / limit);
  if (totalPages < 2) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = []; // <-- حددنا نوع المصفوفة number[]
    for (let i = page - delta; i <= page + delta; i++) {
      if (i >= 1 && i <= totalPages) range.push(i);
    }
    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => setPage(1)}>⏮</button>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>◀</button>

      {pageNumbers[0] > 1 && <span>...</span>}

      {pageNumbers.map((p) => (
        <button
          key={p}
          className={page === p ? "active" : ""}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}

      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>▶</button>
      <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>⏭</button>
    </div>
  );
}

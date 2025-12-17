import { NextResponse } from "next/server";
import type { Product } from "@/types/product";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const q = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toLowerCase() || "";
    const minPrice = Number(searchParams.get("minPrice")) || null;
    const maxPrice = Number(searchParams.get("maxPrice")) || null;
    const sort = searchParams.get("sort") || "";

    // Fetch all items
    const res = await fetch("https://dummyjson.com/products?limit=0");
    const json = await res.json();
    let products: Product[] = json.products || [];

    // -------- SEARCH FILTER --------
    if (q) {
      products = products.filter((p) =>
        (p.title?.toLowerCase() || "").includes(q) ||
        (p.description?.toLowerCase() || "").includes(q)
      );
    }

    // -------- CATEGORY FILTER --------
    if (category) {
      products = products.filter(
        (p) => (p.category?.toLowerCase() || "") === category
      );
    }

    // -------- PRICE FILTER --------
    if (minPrice !== null) {
      products = products.filter((p) => Number(p.price) >= minPrice);
    }
    if (maxPrice !== null) {
      products = products.filter((p) => Number(p.price) <= maxPrice);
    }

    // -------- SORTING --------
    if (sort === "price_asc") products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price_desc") products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "rating_desc") products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "name_asc") products.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (sort === "name_desc") products.sort((a, b) => (b.title || "").localeCompare(a.title || ""));

    const total = products.length;

    // -------- PAGINATION --------
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return NextResponse.json({
      data: paginated,
      total,
      page,
      limit,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

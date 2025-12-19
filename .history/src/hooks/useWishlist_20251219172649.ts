"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { WishlistItem } from "@/types/whishlist";

const WISHLIST_QUERY_KEY = ["wishlist"];
const STALE_TIME = 1000 * 60 * 5;

async function apiFetch<T>(url: string, token: string | null, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  return res.json();
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = session?.user?.token || null;
  const isReady = !!token && status === "authenticated";

  const { data: items = [], isLoading, isError } = useQuery<WishlistItem[]>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => apiFetch<WishlistItem[]>("/api/wishlist", token),
    enabled: isReady,
    staleTime: STALE_TIME,
    retry: 0,
  });

  const addItem = useMutation<WishlistItem[], Error, WishlistItem>({
    mutationFn: (item) =>
      apiFetch<WishlistItem[]>("/api/wishlist", token, {
        method: "POST",
        body: JSON.stringify(item),
      }),
    onSuccess: () => {
      toast.success("Item added to wishlist");
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const removeItem = useMutation<WishlistItem[], Error, string>({
    mutationFn: (id) =>
      apiFetch<WishlistItem[]>("/api/wishlist", token, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => {
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const clearWishlist = useMutation<WishlistItem[], Error>({
    mutationFn: () =>
      apiFetch<WishlistItem[]>("/api/wishlist", token, { method: "DELETE", body: JSON.stringify({ clearAll: true }) }),
    onSuccess: () => {
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  return { items, isLoading, isError, addItem, removeItem, clearWishlist };
}

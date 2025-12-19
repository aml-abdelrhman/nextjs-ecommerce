"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { CartItem } from "@/types/cart";

const CART_QUERY_KEY = ["cart"];
const STALE_TIME = 1000 * 60 * 5;

async function apiFetch<T>(url: string, token: string | null, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  return res.json();
}

export function useCart() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token || null;

  const { data: items = [], isLoading, isError } = useQuery<CartItem[]>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => apiFetch<CartItem[]>("/api/cart", token),
    enabled: !!token, 
    staleTime: STALE_TIME,
    retry: 0,
  });

  const addItem = useMutation<CartItem[], Error, CartItem>({
    mutationFn: (item) => apiFetch<CartItem[]>("/api/cart", token, { method: "POST", body: JSON.stringify(item) }),
    onSuccess: () => {
      toast.success("Item added to cart");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Failed to add item to cart");
    },
  });

  const updateQty = useMutation<CartItem[], Error, { id: string; qty: number }>({
    mutationFn: ({ id, qty }) => apiFetch<CartItem[]>("/api/cart", token, { method: "PATCH", body: JSON.stringify({ id, qty }) }),
    onSuccess: () => {
      toast.success("Quantity updated");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const removeItem = useMutation<CartItem[], Error, string>({
    mutationFn: (id) => apiFetch<CartItem[]>("/api/cart", token, { method: "DELETE", body: JSON.stringify({ id }) }),
    onSuccess: () => {
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const clearCart = useMutation<CartItem[], Error>({
    mutationFn: () => apiFetch<CartItem[]>("/api/cart/clear", token, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Cart cleared");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  return { items, isLoading, isError, addItem, updateQty, removeItem, clearCart };
}

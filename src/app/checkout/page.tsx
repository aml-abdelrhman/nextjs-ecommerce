"use client";

import React, { useState } from "react";
import "@/styles/CheckoutPage.scss";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { clearCartUI } from "@/store/cartslice";
import { clearWishlistUI } from "@/store/wishlistSlice";

interface OrderResponse {
  orderId: string;
}

export default function CheckoutPage() {
  const [address, setAddress] = useState({ fullName: "", phone: "", city: "", street: "" });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cash">("card");
  const [notes, setNotes] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const userEmail = session?.user?.email ?? "";
  const userId = session?.user?.id ?? "";

  const items = useSelector((state: RootState) => state.cart.items) ?? [];
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const checkoutMutation = useMutation<OrderResponse, Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userId}` },
        body: JSON.stringify({ userEmail, userId, items, total: totalPrice, address, paymentMethod, notes }),
      });
      if (!res.ok) throw new Error(await res.text() || "Checkout failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Order placed! Order ID: ${data.orderId}`);
      dispatch(clearCartUI());
      dispatch(clearWishlistUI());
      router.push("/account/orders");
    },
    onError: (err) => toast.error(`Checkout failed: ${err.message}`),
  });

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") return <p>Loading...</p>;

  const isProcessing = checkoutMutation.status === "pending";

  return (
    <div className="checkoutWrapper wrapper">
      <div className="checkoutLeft section">
        <h2 className="heading">Shipping Details</h2>
        <input className="input" placeholder="Full Name" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} />
        <input className="input" placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
        <input className="input" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        <input className="input" placeholder="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
        <textarea className="input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as "card" | "paypal" | "cash")}>
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Cash on Delivery</option>
        </select>
        <button className="btnPrimary" onClick={() => checkoutMutation.mutate()} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Place Order"}
        </button>
      </div>

      <div className="checkoutRight right section">
        <h2 className="heading">Order Summary</h2>
        {items.map(item => (
          <div key={item.id} className="summaryItem">
            <span>{item.title} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="total">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

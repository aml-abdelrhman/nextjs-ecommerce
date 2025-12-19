"use client";

import React, { useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  increaseQtyLocal,
  decreaseQtyLocal,
  removeItemLocal,
  clearCartUI,
  addItemLocal
} from "@/store/cartslice";
import toast from "react-hot-toast";
import "@/styles/cart.scss";
import { CartItem } from "@/types/cart";
import Link from "next/link";

interface CartItemProps {
  item: CartItem;
  onIncrease: (id: string, qty: number) => void;
  onDecrease: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent = React.memo(
  ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => (
    <div className="cartItem">
      <div className="info">
        <div className="title">{item.title}</div>
        <div className="qtyControls">
          <button onClick={() => onDecrease(item.id, item.qty)}>-</button>
          <span>{item.qty}</span>
          <button onClick={() => onIncrease(item.id, item.qty)}>+</button>
        </div>
      </div>
      <strong className="price">${(item.price * item.qty).toFixed(2)}</strong>
      <button className="remove" onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  )
);

CartItemComponent.displayName = "CartItemComponent";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const localCart: CartItem[] = useSelector((state: RootState) => state.cart.items);


  const handleIncrease = useCallback(
    (id: string, qty: number) => {
      dispatch(increaseQtyLocal(id));
    },
    [dispatch]
  );

  const handleDecrease = useCallback(
    (id: string, qty: number) => {
      if (qty <= 1) return;
      dispatch(decreaseQtyLocal(id));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeItemLocal(id));
      toast.success("Item removed!");
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    if (localCart.length === 0) {
      toast("Cart is already empty.");
      return;
    }
    if (confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCartUI());
      toast.success("Cart cleared!");
    }
  }, [dispatch, localCart.length]);

  if (status === "loading") return <p className="loading">Loading your cart...</p>;

  if (!session) {
    return (
      <div className="loginPrompt">
        <h1>Please login first to see your cart</h1>
        <button className="loginBtn" onClick={() => signIn()}>
          Login Now
        </button>
      </div>
    );
  }

  const total: number = localCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cartPage">
      <h1>Your Cart 🛒</h1>

      {localCart.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link href="/products" className="exploreBtn">Explore Products</Link>
        </div>
      ) : (
        <>
          {localCart.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}

          <div className="total">Total: ${total.toFixed(2)}</div>

          <button className="clearBtn" onClick={handleClearCart}>Clear Cart</button>

          <Link href="/checkout" className="btn-primary">Go to Checkout</Link>
        </>
      )}
    </div>
  );
}

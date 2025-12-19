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
} from "@/store/cartslice";
import { useCart } from "@/hooks/usecart";
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
  ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => {
    return (
      <div className="cartItem">
        <div className="info">
          <div className="title">{item.title}</div>
          <div className="qtyControls">
            <button aria-label="Decrease quantity" onClick={() => onDecrease(item.id, item.qty)}>-</button>
            <span>{item.qty}</span>
            <button aria-label="Increase quantity" onClick={() => onIncrease(item.id, item.qty)}>+</button>
          </div>
        </div>

        <strong className="price">${(item.price * item.qty).toFixed(2)}</strong>

        <button className="remove" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    );
  }
);

CartItemComponent.displayName = "CartItemComponent";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const localCart: CartItem[] = useSelector((state: RootState) => state.cart.items);
  const { updateQty, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleIncrease = useCallback(
    (id: string, qty: number) => {
      dispatch(increaseQtyLocal(id));
      updateQty.mutate({ id, qty: qty + 1 }, { onError: () => toast.error("Failed to update quantity.") });
    },
    [dispatch, updateQty]
  );

  const handleDecrease = useCallback(
    (id: string, qty: number) => {
      if (qty <= 1) return;
      dispatch(decreaseQtyLocal(id));
      updateQty.mutate({ id, qty: qty - 1 }, { onError: () => toast.error("Failed to update quantity.") });
    },
    [dispatch, updateQty]
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeItemLocal(id));
      removeItem.mutate(id, { onSuccess: () => toast.success("Item removed!"), onError: () => toast.error("Failed to remove item.") });
    },
    [dispatch, removeItem]
  );

  const handleClearCart = useCallback(() => {
    if (localCart.length === 0) {
      toast("Cart is already empty.");
      return;
    }
    if (confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCartUI());
      clearCart.mutate(undefined, { onSuccess: () => toast.success("Cart cleared!"), onError: () => toast.error("Failed to clear cart.") });
    }
  }, [dispatch, clearCart, localCart.length]);

  if (status === "loading") return <p className="loading">Loading your cart...</p>;

  if (!session)
    return (
      <div className="loginPrompt">
        <h1>Please login to view your cart</h1>
        <button className="loginBtn" onClick={() => signIn()}>Login Now</button>
      </div>
    );

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

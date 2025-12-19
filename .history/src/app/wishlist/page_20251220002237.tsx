"use client";

import React, { useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  removeItemLocal as removeItemLocalWL,
  clearWishlistUI,
} from "@/store/wishlistSlice";
import { addItemLocal as addItemLocalCart } from "@/store/cartslice";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/usecart";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types/cart";
import "@/styles/wishlist.scss";

interface WishlistItemProps {
  item: {
    id: string;
    title: string;
    image?: string;
    price?: number;
  };
  onAddToCart: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

const WishlistItemComponent: React.FC<WishlistItemProps> = React.memo(
  ({ item, onAddToCart, onRemove }) => {
    return (
      <div className="wishlistItem">
        <div className="info">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.title}
            width={80}
            height={80}
          />
          <div className="title">{item.title}</div>
        </div>
        <strong>{item.price ?? 0} EGP</strong>
        <button
          className="addToCartBtn"
          onClick={() =>
            onAddToCart({
              ...item,
              price: item.price ?? 0,
              qty: 1,
            })
          }
        >
          Add to Cart
        </button>
        <button className="remove" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    );
  }
);

WishlistItemComponent.displayName = "WishlistItemComponent";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const localWishlist = useSelector((state: RootState) => state.wishlist.items);
  const { removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeItemLocalWL(id));
      removeItem.mutate(id, {
        onSuccess: () => toast.success("Item removed!"),
        onError: () => toast.error("Failed to remove item."),
      });
    },
    [dispatch, removeItem]
  );

  const handleAddToCart = useCallback(
    (item: CartItem) => {
      dispatch(addItemLocalCart(item));
      addItem.mutate(item, {
        onSuccess: () => toast.success("Added to cart!"),
        onError: () => toast.error("Failed to add to cart!"),
      });
      dispatch(removeItemLocalWL(item.id));
      removeItem.mutate(item.id);
    },
    [dispatch, addItem, removeItem]
  );

  const handleClear = useCallback(() => {
    if (localWishlist.length === 0) {
      toast("Wishlist is already empty.");
      return;
    }
    if (confirm("Are you sure you want to clear your wishlist?")) {
      dispatch(clearWishlistUI());
      clearWishlist.mutate(undefined, {
        onSuccess: () => toast.success("Wishlist cleared!"),
        onError: () => toast.error("Failed to clear wishlist."),
      });
    }
  }, [dispatch, clearWishlist, localWishlist]);

  if (status === "loading") return <p>Loading your wishlist...</p>;

  if (!session)
    return (
      <div className="loginPrompt">
        <h1>Please login to view your wishlist</h1>
        <button onClick={() => signIn()}>Login Now</button>
      </div>
    );

  return (
    <div className="wishlistPage">
      <h1>Your Wishlist ❤️</h1>

      {localWishlist.length === 0 ? (
        <div className="empty">
        <p>Your wishlist is empty.</p>
        <Link href="/products" className="exploreBtn">Explore Products</Link>
      
      ) : (
        <>
          {localWishlist.map((item) => (
            <WishlistItemComponent
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
            />
          ))}

          <button className="clearBtn" onClick={handleClear}>
            Clear Wishlist
          </button>

          <Link href="/" className="btn-primary">
            Explore Products
          </Link>
        </>
      )}
    </div>
  );
}

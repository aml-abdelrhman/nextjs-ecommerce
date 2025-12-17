"use client";
import React from "react";
import Image from "next/image";
import "@/styles/products/Card.scss";
import { Product } from "@/types/product";
import { useAppDispatch } from "@/store/hooks";
import { addItemLocal } from "@/store/cartslice"; 
import { useCart } from "@/hooks/usecart"; 
import { useWishlist } from "@/hooks/useWishlist"; 
import { addItemLocal as addItemLocalWL } from "@/store/wishlistSlice";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { addItem: addCartItem } = useCart(); 
  const { addItem: addWishlistItem } = useWishlist();

  const handleAddToCart = () => {
    const item = {
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      qty: 1,
      discount: product.discountPercentage,
      rating: product.rating,
      image: product.thumbnail,
    };

    dispatch(addItemLocal(item));
    addCartItem.mutate(item, {
      onSuccess: () => toast.success("Added to cart!"),
      onError: () => toast.error("Failed to add item."),
    });
  };

  const handleAddToWishlist = () => {
    const item = {
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      image: product.thumbnail,
    };

    dispatch(addItemLocalWL(item));
    addWishlistItem.mutate(item, {
      onSuccess: () => toast.success("Added to wishlist!"),
      onError: () => toast.error("Failed to add to wishlist."),
    });
  };

  return (
    <div className="card">
      <div className="thumb">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={300}
          className="img"
        />
      </div>
      <div className="content">
        <h3 className="title">{product.title}</h3>
        <div className="meta">
          <span className="brand">{product.brand}</span>
          <span className="rating">⭐ {product.rating ?? "—"}</span>
        </div>
        <div className="priceRow">
          {product.discountPercentage ? (
            <span className="discount">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          ) : null}
          <span className="price">${product.price}</span>
        </div>
        <div className="actions">
          <button onClick={handleAddToCart} className="addBtn">
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="wishBtn"
            aria-label="Add to wishlist"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import styles from "@/styles/products/Skeleton.module.scss";

type Props = {
  count?: number; 
};

const ProductSkeleton: React.FC<Props> = ({ count = 8 }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.title} />
          <div className={styles.price} />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;

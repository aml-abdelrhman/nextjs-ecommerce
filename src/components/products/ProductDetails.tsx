"use client";

import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";
import styles from "./ProductDetails.module.scss";

interface ProductDetailsProps {
  id: string;
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const { data, isLoading, error } = useProduct(id);

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product: {error.message}</p>;
  if (!data) return <p>No product found</p>;

  const mainImage = data.thumbnail || "/placeholder.png";

  return (
    <div className={styles.productDetails}>
      <div className={styles.images}>
        <div className={styles.mainImage}>
          <Image
            src={mainImage}
            alt={data.title}
            width={500}
            height={500}
            priority
            style={{ objectFit: "cover" }}
          />
        </div>

        {data.images && data.images.length > 0 && (
          <div className={styles.gallery}>
            {data.images.map((img: string, index: number) => (
              <Image
                key={index}
                src={img || "/placeholder.png"}
                alt={`${data.title} image ${index + 1}`}
                width={90}
                height={90}
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h1>{data.title}</h1>
        {data.description && <p className={styles.description}>{data.description}</p>}
        <p className={styles.price}>${data.price.toFixed(2)}</p>
        {data.category && <p className={styles.category}>Category: {data.category}</p>}
        <button className={styles.addBtn}>Add to Cart</button>
      </div>
    </div>
  );
}

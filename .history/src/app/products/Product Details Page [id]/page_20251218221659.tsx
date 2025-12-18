import { getProduct } from "@/lib/api";
import { Product } from "@/types/product";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import styles from "@/styles/products/ProductDetails.scss";

type Props = { params: { id: string } };

export async function generateStaticParams() {
  const res = await fetch("https://dummyjson.com/products?limit=20");
  const data = await res.json();
  return data.products.map((p: Product) => ({ id: p.id.toString() }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const product: Product = await getProduct(Number(params.id));

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={500}
          height={500}
        />
      </div>

      <div className={styles.details}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <div className={styles.priceRow}>
          {product.discountPercentage && (
            <span className="discount">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          )}
          <span className="price">${product.price}</span>
        </div>
        <div className={styles.rating}>⭐ {product.rating}</div>
        <div className={styles.productCardWrapper}>
          <ProductCard product={product} />
        </div>
      </div>
    </div>
  );
}

// src/app/products/[productId]/page.tsx
import { getProduct } from "@/lib/api";
import { Product } from "@/types/product";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import "@/styles/products/ProductDetails.scss";

type Props = { params: { productId: string } };


export async function generateStaticParams() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=20");
    const data = await res.json();
    return data.products
   .filter((p: Product) => p.id && p.thumbnail)
      .map((p: Product) => ({ productId: p.id.toString() }));
  } catch (err) {
    console.error("Failed to fetch products for generateStaticParams", err);
    return [];
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  let product: Product | null = null;

  try {
    product = await getProduct(Number(params.productId));
  } catch (err) {
    console.error(`Product not found: ${params.productId}`);
  }

  if (!product) {
    return (
      <div className="product-details">
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="images-section">
        <Image
          className="main-image"
          src={product.thumbnail}
          alt={product.title}
          width={500}
          height={500}
        />
      </div>

      <div className="info-section">
        <h1>{product.title}</h1>
        <p className="description">{product.description}</p>

        <div className="price-row">
          {product.discountPercentage && (
            <span className="discount">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          )}
          <span className="price">${product.price}</span>
        </div>

        <div className="rating">⭐ {product.rating}</div>

        <div className="product-card-wrapper">
          <ProductCard product={product} />
        </div>

        <button className="add-cart">Add to Cart</button>
      </div>
    </div>
  );
}

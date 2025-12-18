import { getProduct } from "@/lib/api";
import { Product } from "@/types/product";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import "@/styles/products/ProductDetails.scss"; // SCSS عادي

type Props = { params: { id: string } };

export async function generateStaticParams() {
  const res = await fetch("https://dummyjson.com/products?limit=20");
  const data = await res.json();
  return data.products.map((p: Product) => ({ id: p.id.toString() }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const product: Product = await getProduct(Number(params.id));

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
        {/* إذا عندك thumbs للصور الجانبية، ضعيها هنا */}
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

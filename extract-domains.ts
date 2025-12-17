import fetch from "node-fetch";

async function getImageDomains() {
  try {
    const res = await fetch("http://localhost:3000/api/products"); // غير الرابط حسب API عندك
    const products = await res.json();

    const domains = new Set<string>();

    products.forEach((product: { image: string }) => {
      if (!product.image) return;
      try {
        const domain = new URL(product.image).hostname;
        domains.add(domain);
      } catch (err) {
        console.error("Invalid URL:", product.image, err);
      }
    });

    console.log("Domains to add in next.config.js:");
    console.log(Array.from(domains));
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

getImageDomains();

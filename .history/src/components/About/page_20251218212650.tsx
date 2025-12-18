"use client";

import React from "react";
import InfoSection from "@/components/InfoSection/InfoSection/InfoSection";

export default function AboutPage() {
  return (
    <div>
      <InfoSection
        title="About Our Store"
        paragraphs={[
         "We provide high-quality products at the best prices, carefully selected to meet your needs.",
         "Our team is committed to offering the latest trends and exclusive collections.",
         "Fast shipping, secure payments, and excellent customer service are our top priorities.",
         "We aim to create a seamless shopping experience for every customer, online or offline."
        ]}
        image="https://images.pexels.com/photos/6214480/pexels-photo-6214480.jpeg"
        btnText="Shop Now"
        btnLink="/products"
      />
    </div>
  );
}

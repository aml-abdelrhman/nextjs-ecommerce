"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import "./HeroCarousel.scss";

interface Slide {
  id: number;
  image: string;
}

const slides: Slide[] = [
  { id: 1, image: "https://images.pexels.com/photos/9594428/pexels-photo-9594428.jpeg" },
  { id: 2, image: "https://images.pexels.com/photos/749353/pexels-photo-749353.jpeg" },
  { id: 3, image: "https://images.pexels.com/photos/6214472/pexels-photo-6214472.jpeg" },
];

const HeroCarousel: FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="heroCarousel">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`slide ${idx === current ? "active" : ""}`}
        >
          <Image
            src={slide.image}
            alt={`Hero banner ${slide.id}`}
            fill
            style={{ objectFit: "cover" }}
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={idx === current ? "dot active" : "dot"}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

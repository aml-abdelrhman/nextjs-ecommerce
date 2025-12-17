"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/InfoSection.scss";

type InfoSectionProps = {
  title: string;
  paragraphs: readonly string[];
  image: string;
  btnText?: string;
  btnLink?: string;
  reverse?: boolean;
};

function InfoSection({
  title,
  paragraphs,
  image,
  btnText,
  btnLink,
  reverse = false,
}: InfoSectionProps) {
  return (
    <section className={`infoSection ${reverse ? "reverse" : ""}`} aria-labelledby="info-title">
      <div className="container">
        
        <div className="infoImage">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            quality={80}
            loading="lazy"
          />
        </div>

        <div className="infoContent">
          <h2 id="info-title">{title}</h2>

          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          {btnText && btnLink && (
            btnLink.startsWith("/") ? (
              <Link href={btnLink} className="btnPrimary" aria-label={btnText}>
                {btnText}
              </Link>
            ) : (
              <a href={btnLink} className="btnPrimary" aria-label={btnText}>
                {btnText}
              </a>
            )
          )}
        </div>

      </div>
    </section>
  );
}

export default React.memo(InfoSection);

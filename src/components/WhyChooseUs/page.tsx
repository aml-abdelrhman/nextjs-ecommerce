"use client";

import React from "react";
import InfoSection from "@/components/InfoSection/InfoSection"; 

const WhyChooseUsSection = () => {
  return (
    <InfoSection
      title="Why Choose Us?"
     paragraphs={[
       "We offer a wide variety of products to suit every style and budget.",
       "Our customer support is available 24/7 to help you with any inquiries or concerns.",
       "We ensure top-notch quality for all items, backed by trusted suppliers and brands.",
        "Enjoy fast shipping, hassle-free returns, and a smooth checkout process every time."
      ]}
      image="https://images.pexels.com/photos/14474007/pexels-photo-14474007.jpeg" 
      reverse
      btnText="Learn More"
      btnLink="/support"
    />
  );
};

export default WhyChooseUsSection;

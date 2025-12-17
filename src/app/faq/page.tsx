"use client";
import React, { useState } from "react";
import "@/styles/FAQPage.scss";

const faqData = [
  {
    question: "Are all products authentic?",
    answer: "Yes, all our products are 100% genuine and quality guaranteed.",
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping usually takes between 2 to 5 business days.",
  },
  {
    question: "Can I return or exchange my order?",
    answer: "You may return or exchange your order within 14 days of delivery.",
  },
  {
    question: "Is cash on delivery available?",
    answer: "Yes, multiple payment options are supported including cash on delivery.",
  },
  {
    question: "Is my personal information secure?",
    answer: "We use industry-grade security protocols to protect all customer data.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqPage container">
      <h1>Frequently Asked Questions</h1>
      <div className="faqList">
        {faqData.map((item, index) => (
          <div key={index} className="faqItem">
            <button className="question" onClick={() => toggle(index)}>
              {item.question}
              <span className={`arrow ${openIndex === index ? "open" : ""}`}>&#9660;</span>
            </button>
            {openIndex === index && <p className="answer">{item.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;

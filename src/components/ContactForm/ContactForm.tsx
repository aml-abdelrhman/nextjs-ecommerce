"use client";

import React, { useState } from "react";
import "@/styles/ContactForm.scss";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 300) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("جارٍ الإرسال...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ تم إرسال رسالتك بنجاح!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ فشل الإرسال: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div className="contactFormContainer">
      <h2>تواصل معنا</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" required />
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="رسالتك (حتى 300 حرف)" required />
        <div className="charCount">{formData.message.length}/300</div>
        <button type="submit">إرسال</button>
        {status && <div className="statusMessage">{status}</div>}
      </form>
    </div>
  );
}

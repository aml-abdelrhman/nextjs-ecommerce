"use client";

import React, { useState } from "react";
import "@/styles/JoinUsForm.scss";

interface JoinUsData {
  name: string;
  email: string;
}

export default function JoinUsForm() {
  const [formData, setFormData] = useState<JoinUsData>({ name: "", email: "" });
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("جارٍ الإرسال...");

    try {
      const res = await fetch("/api/joinus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ تم التسجيل بنجاح!");
        setFormData({ name: "", email: "" });
      } else {
        setStatus(`❌ فشل التسجيل: ${data.error}`);
      }
    } catch {
      setStatus("⚠️ حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div className="joinUsContainer">
      <h2>Join Us</h2>
      <p>اشترك الآن لتصلك أحدث الدروس والدورات</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="الاسم" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
        <button type="submit">انضم الآن</button>
        {status && <div className="statusMessage">{status}</div>}
      </form>
    </div>
  );
}

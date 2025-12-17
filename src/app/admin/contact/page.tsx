"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "@/styles/admin/AdminContact.scss";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch("/api/admin/contact");
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to fetch messages");
        }

        setMessages(data.messages);
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error("حدث خطأ في تحميل الرسائل");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="adminContactPage">
      <h1 className="dashboardTitle">Contact Messages</h1>

      {messages.length === 0 ? (
        <p>لا توجد رسائل</p>
      ) : (
        <div className="messagesGrid">
          {messages.map((msg) => (
            <div className="messageCard" key={msg._id}>
              <h3>{msg.name}</h3>
              <p className="email">{msg.email}</p>
              <p className="message">{msg.message}</p>
              <span className="date">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

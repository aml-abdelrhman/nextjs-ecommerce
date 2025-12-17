"use client";
import { useEffect, useState } from "react";
import "@/styles/admin/AdminDashboard.scss";

export default function AdminJoinUsPage() {
  const [entries, setEntries] = useState<{ _id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const res = await fetch("/api/admin/joinus");
      const data = await res.json();
      setEntries(data.entries);
    };
    loadEntries();
  }, []);

  return (
    <div className="adminPage container">
      <h1>Join Us Subscriptions</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e._id} className="border">
              <td className="p-2">{e.name}</td>
              <td className="p-2">{e.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

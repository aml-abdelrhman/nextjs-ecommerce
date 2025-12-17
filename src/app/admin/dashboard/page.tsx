"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "@/styles/admin/AdminDashboard.scss";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, uploads: 0, support: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    }
  };

    loadStats();
  }, []);

  return (
    <>
      <h1 className="dashboardTitle">Dashboard Overview</h1>

      <div className="statsGrid">
        <div className="statCard">
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="statCard">
          <h3>Support</h3>
          <p>{stats.support}</p>
        </div>
      </div>
    </>
  );
}

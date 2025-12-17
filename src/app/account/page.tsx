"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import "@/styles/DashboardHome.scss";

type DashboardStats = {
  user: { name: string };
  stats: {
    ordersCount: number;
    wishlistCount: number;
    lastOrder?: { status: string; total: number } | null;
  };
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/account", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");

        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {stats.user.name}
        </h1>
      </div>

      <div className="cardsGrid">
        <Card className="card">
          <CardContent className="cardContent">
            <p className="label">Total Orders</p>
            <h2 className="value">{stats.stats.ordersCount}</h2>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="cardContent">
            <p className="label">Wishlist Items</p>
            <h2 className="value">{stats.stats.wishlistCount}</h2>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="cardContent">
            <p className="label">Last Order</p>
            {stats.stats.lastOrder ? (
              <>
                <p className="orderText">
                  Status: {stats.stats.lastOrder.status}
                </p>
                <p className="orderText">
                  Total: ${stats.stats.lastOrder.total}
                </p>
              </>
            ) : (
              <>
                <p className="orderText muted">No orders yet</p>
                {stats.stats.ordersCount === 0 && (
                  <Link href="/products" className="btn-shop">
                   Explore Products
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

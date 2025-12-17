"use client";

import { useEffect, useState } from "react";
import { Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import "@/styles/OrdersPage.scss";

type OrderStatus = "processing" | "shipped" | "completed" | "cancelled";

type Order = {
  _id: string;
  items: { name: string; price: number; quantity: number }[];
  status: OrderStatus;
  total: number;
  address: { fullName: string; phone: string; city: string; street: string };
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/user/orders", { credentials: "include" });
        const data = await res.json();
        if (data.ok) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function deleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/user/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading)
    return (
      <div className="orders-loader">
        <Loader2 className="orders-spinner" /> Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="orders-empty">
        <p className="orders-info">You have no orders.</p>
        <Link href="/products" className="btn-explore">
          Explore Products
        </Link>
      </div>
    );

  return (
    <div className="orders-wrapper">
      <h1 className="orders-heading">My Orders</h1>

      {orders.map(order => {
        const isOpen = openOrderId === order._id;

        return (
          <div key={order._id} className="orders-item">
            <button
              className="orders-deleteBtn"
              disabled={updatingId === order._id}
              onClick={() => deleteOrder(order._id)}
            >
              <X size={16} />
            </button>

            <div className="orders-main">
              <div>
                <p className="orders-orderId">Order #{order._id}</p>
                <p className={`orders-status orders-${order.status}`}>
                  {order.status}
                </p>
                <p className="orders-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="orders-actions">
                <p className="orders-total">${order.total.toFixed(2)}</p>

                <button
                  className="orders-toggleBtn"
                  onClick={() => setOpenOrderId(isOpen ? null : order._id)}
                >
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="orders-details">
                <div className="orders-address">
                  <h4>Shipping Address</h4>
                  <p>{order.address.fullName}</p>
                  <p>{order.address.phone}</p>
                  <p>
                    {order.address.street}, {order.address.city}
                  </p>
                </div>

                <div className="orders-items">
                  <h4>Items</h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="orders-itemRow">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

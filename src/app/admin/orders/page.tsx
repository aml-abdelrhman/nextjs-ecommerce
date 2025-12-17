"use client";

import { useEffect, useState } from "react";
import "@/styles/admin/AdminOrdersPage.scss";
import { X } from "lucide-react";

type OrderStatus = "processing" | "shipped" | "completed" | "cancelled";

type Order = {
  _id: string;
  userEmail: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  status: OrderStatus;
  total: number;
  address: { fullName: string; phone: string; city: string; street: string };
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.ok) setOrders(data.orders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    if (data.ok) setOrders(prev => prev.map(o => (o._id === orderId ? data.order : o)));
    setUpdatingId(null);
  }

  async function deleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setUpdatingId(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    if (data.ok) setOrders(prev => prev.filter(o => o._id !== orderId));
    setUpdatingId(null);
  }

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="container">
      <div className="adminOrdersPage">
        <h1>Orders Management</h1>
        <div className="table-wrapper">
          <table className="adminOrdersTable">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Items</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.address.fullName}</td>
                  <td>{order.userEmail}</td>
                  <td>
                    {order.items.map(item => (
                      <div key={item.productId}>{item.name} × {item.quantity}</div>
                    ))}
                  </td>
                  <td><span className={`status ${order.status}`}>{order.status}</span></td>
                  <td>
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={e => updateStatus(order._id, e.target.value as OrderStatus)}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.total} EGP</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="deleteBtn"
                      disabled={updatingId === order._id}
                      onClick={() => deleteOrder(order._id)}
                    >
                      <div className="deleteIconWrapper">
                        <X size={16} color="white" />
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

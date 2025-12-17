"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Address = {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
};

export default function DeleteAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/user/addresses", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch addresses");
        setAddresses(data.addresses);
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/user/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ addressId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete address");

      toast.success("Address deleted successfully!");
      setAddresses(addresses.filter(addr => addr._id !== id));
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="accountContent">
      <h1>Delete Addresses</h1>
      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <ul>
          {addresses.map(addr => (
            <li key={addr._id} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
              <p><strong>{addr.fullName}</strong></p>
              <p>Phone: {addr.phone}</p>
              <p>{addr.street}, {addr.city}</p>
              <button
                onClick={() => handleDelete(addr._id)}
                disabled={deletingId === addr._id}
              >
                {deletingId === addr._id ? "Deleting..." : "Delete Address"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

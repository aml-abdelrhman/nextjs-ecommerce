"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Address = {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
};

export default function AddressPage() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/user/address", { credentials: "include" });
        const data = await res.json();
        console.log("GET addresses response:", data);

        if (!data.ok) throw new Error(data.error || "Failed to fetch addresses");
        setAddresses(data.addresses);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
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
      if (!data.ok) throw new Error(data.error || "Failed to delete address");

      toast.success("Address deleted successfully!");
      setAddresses(addresses.filter(addr => addr._id !== id));
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="accountContent">
        <p className="loading">
          <Loader2 className="spinner" /> Loading addresses...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="accountContent">
        <p className="error">Error: {error}</p>
      </div>
    );

  return (
    <div className="accountContent">
      <h1>Addresses</h1>

      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <ul>
          {addresses.map(addr => (
            <li key={addr._id} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p><strong>{addr.fullName}</strong></p>
                <p>Phone: {addr.phone}</p>
                <p>{addr.street}, {addr.city}</p>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleDelete(addr._id)}
                  disabled={deletingId === addr._id}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "red" }}
                  title="Delete Address"
                >
                  {deletingId === addr._id ? "Deleting..." : <X />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link href="/account/address/new" className="btnPrimary">
          Add New Address
        </Link>
      </div>
    </div>
  );
}

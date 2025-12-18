"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import "@/styles/EditAddressPage.scss";

type Address = {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
};

export default function EditAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("id");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!addressId) {
      toast.error("Invalid address");
      router.push("/account/address");
      return;
    }

    async function fetchAddress() {
      try {
        const res = await fetch("/api/user/address", {
          credentials: "include",
        });

        const data: { ok: boolean; addresses: Address[]; error?: string } =
          await res.json();

        if (!res.ok || !data.ok)
          throw new Error(data.error || "Failed to load address");

        const address = data.addresses.find((a) => a._id === addressId);

        if (!address) throw new Error("Address not found");

        setForm({
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
        });
      } catch (err) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Something went wrong";
        toast.error(message);
        router.push("/account/address");
      } finally {
        setLoading(false);
      }
    }

    fetchAddress();
  }, [addressId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          addressId,
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
        }),
      });

      const data: { ok: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok)
        throw new Error(data.error || "Failed to update address");

      toast.success("Address updated successfully!");
      router.push("/account/address");
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Something went wrong";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="loadingText">Loading address...</p>;
  }

  return (
    <div className="editAddressWrapper">
      <h1 className="editAddressHeading">Edit Address</h1>

      <form className="editAddressForm" onSubmit={handleSubmit}>
        <input
          className="editAddressInput"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          className="editAddressInput"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          className="editAddressInput"
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
          required
        />

        <input
          className="editAddressInput"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btnPrimary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

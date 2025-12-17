"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to logout");
        }

        toast.success("Logged out successfully");
        router.push("/login");
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p className="text-gray-700 text-lg">Logging out...</p>
      ) : (
        <p className="text-gray-700 text-lg">Redirecting...</p>
      )}
    </div>
  );
}

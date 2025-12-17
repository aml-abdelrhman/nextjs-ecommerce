"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          toast.error(data.error || "Invalid or expired verification link.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error("Network error. Try again.");
      }
    }

    verify();
  }, [token, router]);

  async function handleResend() {
    if (!token) return;
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: token }), 
      });

      const data = await res.json();
      if (res.ok) toast.success("Verification email resent!");
      else toast.error(data.error || "Failed to resend verification email.");
    } catch (err) {
      console.error(err);
      toast.error("Network error. Try again.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {status === "loading" && <p className="text-gray-700 text-lg">Verifying your account...</p>}

      {status === "success" && (
        <p className="text-green-600 text-xl font-semibold">
          Your email has been verified! Redirecting to login...
        </p>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600 text-xl font-semibold">
            Invalid or expired verification link.
          </p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            {resendLoading ? "Resending..." : "Resend Verification Email"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import "@/styles/ProfilePage.scss";

type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  emailVerified: boolean;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load profile");
          return;
        }

        setUser(data.user);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="profile-wrapper">
        <p className="profile-loading">
          <Loader2 className="profile-spinner" /> Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="profile-wrapperError">Error: {error}</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-topSection">
        <div className="profile-avatarWrapper">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              width={96}
              height={96}
              alt="Avatar"
              className="profile-avatarImage"
            />
          ) : (
            <div className="profile-noImage">No Image</div>
          )}
        </div>

        <div className="profile-userInfo">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone || "Not set"}</p>       
       </div>

        <div className="profile-editBtnWrapper">
          <Link href="/account/profile/edit" className="btnPrimary">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="profile-cardsWrapper">
        <div className="profile-card">
          <h3 className="profile-cardTitle">Account</h3>
          <p className="profile-cardText">
            You joined on:{" "}
            {user ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <div className="profile-card">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="profile-logoutBtn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

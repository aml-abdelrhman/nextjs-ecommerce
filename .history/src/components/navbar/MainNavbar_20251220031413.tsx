"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useCallback } from "react";
import "@/styles/navbar.scss";
import { Mail, User, Heart, ShoppingCart, LogOut, Settings } from "lucide-react";

export default function MainNavbar() {
  const { data: session, status } = useSession();
  const cartCount = useAppSelector(s => s.cart?.count ?? 0);
  const wishlistCount = useAppSelector(s => s.wishlist?.count ?? 0);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }, []);

  if (status === "loading") {
    return (
      <nav className="main">
        <div className="logo">ONLINE STORE</div>
        <span className="loading">Loading...</span>
      </nav>
    );
  }

  const role = session?.user?.role ?? "user";

  return (
    <nav className="main">
      <Link href="/" className="logo">
        <span>ONLINE STORE</span>
      </Link>

      <div className="icons">
        <div className="iconWrapper">
          <Link href="/wishlist">
            <Heart />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
        </div>

        <div className="iconWrapper">
          <Link href="/cart">
            <ShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>

        <div className="actions">
          {session?.user ? (
            <>
              <span className="username">Hi, {session.user.name ?? "User"}</span>
              <Link
                href={role === "admin" ? "/admin/dashboard" : "/account/profile"}
                className="accountBtn"
              >
                <Settings size={18} /> Account
              </Link>
              <button onClick={handleLogout} className="logoutBtn">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="loginBtn">
              <User /> Login
            </Link>
          )}
          <Link href="/ContactForm" className="contactBtn">
            <Mail /> Send Message
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useCallback } from "react";
import "@/styles/navbar.scss";
import {
  Mail,
  User,
  Heart,
  ShoppingCart,
  LogOut,
  Settings,
} from "lucide-react";

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
      </nav>
    );
  }

  const role = session?.user?.role ?? "user";

  return (
    <nav className="main">
      <Link href="/" className="logo">
        <span>ONLINE STORE</span>
      </Link>

      <div className="right">
        <div className="iconsBar">
          <Link href="/wishlist" className="iconWrapper" aria-label="Wishlist">
            <Heart />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          <Link href="/cart" className="iconWrapper" aria-label="Cart">
            <ShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <Link href="/contact" className="iconWrapper contactIcon" aria-label="Contact">
            <Mail />
          </Link>

          {!session?.user && (
            <Link href="/login" className="iconWrapper" aria-label="Login">
              <User />
            </Link>
          )}
        </div>

        <div className="actions desktopOnly">
          {session?.user && (
            <>
              <span className="username">
                Hi, {session.user.name ?? "User"}
              </span>

              <Link
                href={role === "admin" ? "/admin/dashboard" : "/account/profile"}
                className="actionBtn"
              >
                <Settings size={18} />
                <span>Account</span>
              </Link>

              <button onClick={handleLogout} className="actionBtn danger">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

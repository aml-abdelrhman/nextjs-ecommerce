"use client";

import Link from "next/link";
import { ReactNode } from "react";
import "@/styles/admin/AdminLayout.scss";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="adminLayout">
      <aside className="adminSidebar">
        <h1 className="adminTitle">Admin Panel</h1>

        <nav className="adminNav">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/joinus">joinus</Link>
          <Link href="/admin/contact">contact</Link>
          <Link href="/admin/orders">orders</Link>

        </nav>

        <div className="adminFooter">
          &copy; {new Date().getFullYear()} Company
        </div>
      </aside>

      <main className="adminMain">{children}</main>
    </div>
  );
}

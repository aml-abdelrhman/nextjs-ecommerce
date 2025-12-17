"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShieldCheck,
  MapPin,
  Package,
  LogOut,
} from "lucide-react";
import "@/styles/AccountLayout.scss";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    {
      title: "Account",
      items: [
        { name: "Profile", icon: User, href: "/account/profile" },
        { name: "Addresses", icon: MapPin, href: "/account/address" },
      ],
    },
    {
      title: "Orders",
      items: [{ name: "My Orders", icon: Package, href: "/account/orders" }],
    },
    {
      title: "Security",
      items: [{ name: "Security", icon: ShieldCheck, href: "/account/security" }],
    },
  ];

  return (
    <div className="wrapper">
      <aside className="sidebar">
        {links.map((section, i) => (
          <div key={i} className="section">
            <p className="sectionTitle">{section.title}</p>
            <div className="links">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`link ${active ? "active" : ""}`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            {i < links.length - 1 && <div className="separator" />}
          </div>
        ))}

        <Link href="/logout" className="link logout">
          <LogOut size={18} />
          Logout
        </Link>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

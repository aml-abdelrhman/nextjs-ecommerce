"use client";

import React, { useState } from "react";
import Link from "next/link";
import "@/styles/Bottombar.scss";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/help", label: "Help" },
  { href: "/support", label: "Support" },
];

const BottomNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bottombar">
      <div className="bottombarContainer">
        <div className="topRow">
          <div className="bottombarInfo">
            <span className="bottombarSlogan">Professional Online Shopping Platform</span>
          </div>

          <button
            className="bottombarMenuBtn"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`bottombarContent ${open ? "open" : ""}`}>
          <div className="bottombarLinks">
            {links.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="bottombarSocials">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;

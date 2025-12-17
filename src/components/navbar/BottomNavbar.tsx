"use client";
import React, { useState } from "react";
import Link from "next/link";
import "@/styles/Bottombar.scss";
import { Facebook, Instagram, Twitter, Linkedin, Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/productTab", label: "Shop" },
  { href: "/products", label: "Products" },
  { href: "/About", label: "About" },
  { href: "/ContactForm", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/help", label: "Help" },
  { href: "/support", label: "Support" },
];

const BottomNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bottombar" aria-label="Bottom navigation">
      <div className="bottombarContainer">
        <div className="mobileHeader">
          <button
            className="bottombarHamburgerBtn"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
          <Link href="/" className="bottombarLogo">ONLINE STORE</Link>
        </div>

        <div className={`bottombarLinksWrapper ${menuOpen ? "open" : ""}`}>
          <div className="bottombarLinks">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="bottombarLink">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bottombarSocials">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={22} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={22} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={22} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={22} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(BottomNavbar);

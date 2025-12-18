import "../styles/globals.scss";
import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

import MainNavbar from "@/components/navbar/MainNavbar";
import BottomNavbar from "@/components/navbar/BottomNavbar";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myshop.com"),
  title: {
    default: "My Shop",
    template: "%s | My Shop",
  },
  description: "Modern e-commerce platform built with Next.js & TypeScript",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Toaster position="top-center" />

          <header role="banner" className="navbar">
            <MainNavbar />
            <BottomNavbar />
          </header>

          <main>{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}

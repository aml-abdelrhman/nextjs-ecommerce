import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    reactRemoveProperties: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/product-images/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },

  webpack(config) {
    // alias for @ to src
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  typescript: {
    ignoreBuildErrors: true, // يتجاهل أخطاء TypeScript وقت build
  },

  // إضافات لحل تحذيرات Turbopack
  turbopack: {}, // وجود هذا السطر يمنع crash Turbopack مع webpack
  outputFileTracingRoot: __dirname, // لحل warning بتاع lockfiles

  eslint: {
    ignoreDuringBuilds: true, // لتجاهل تحذيرات ESLint وقت build
  },
};

export default nextConfig;

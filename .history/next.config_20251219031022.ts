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
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {},

  outputFileTracingRoot: __dirname,

  experimental: {
    runtime: "nodejs",
  },
};

export default nextConfig;

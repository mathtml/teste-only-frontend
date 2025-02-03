import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@pages": path.resolve(__dirname, "src/app/(pages)"), // Mantém a organização sem afetar a URL
    };
    return config;
  },
};

export default nextConfig;

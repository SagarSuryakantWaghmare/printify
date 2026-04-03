import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.cloudinary.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Turbopack: alias browser-only packages to empty on server
  turbopack: {
    resolveAlias: {
      
    },
  },
};

export default nextConfig;

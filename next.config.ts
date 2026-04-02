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
      // onnxruntime-web is browser-only, alias to empty module on server
      "onnxruntime-web": {
        browser: "onnxruntime-web",
        default: "./lib/empty-module.js",
      },
      "onnxruntime-web/webgpu": {
        browser: "onnxruntime-web/webgpu", 
        default: "./lib/empty-module.js",
      },
    },
  },
};

export default nextConfig;

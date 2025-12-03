import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------
  // هام جداً: هذا السطر هو الذي سيصلح مشكلة التصميم المكسور
  // يخبر Next.js أن الموقع يعمل داخل مجلد /main-front
  // ---------------------------------------------------------
  basePath: "/main-front",

  reactStrictMode: true,

  // Required for static export (Next.js SSG)
  output: "export",
  distDir: "out",

  // Disable image optimization (required for static export)
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/**",
      },
    ],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
    ],
  },
};

export default nextConfig;

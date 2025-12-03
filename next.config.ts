import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // ---------------------------------------------------------
  // هام: basePath للـ GitHub Pages فقط، لا يعمل على localhost
  // يضاف تلقائياً في production، يُحذف في development
  // ---------------------------------------------------------
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/main-front',
  }),
  
  // Enable static export for GitHub Pages deployment
  output: 'export',
  
  // Disable image optimization for static export (required for output: export)
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/**',
      },
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Enable compression
  compress: true,
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cqtluudfmigefqphmfbb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      }
    ],
  },
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      }
    ];
    return [
      {
        source: '/_next/static/:path*',
        headers: securityHeaders
      },
      {
        source: '/robots.txt',
        headers: securityHeaders
      },
      {
        source: '/sitemap.xml',
        headers: securityHeaders
      },
      {
        source: '/manifest.webmanifest',
        headers: securityHeaders
      },
      {
        source: '/favicon.ico',
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
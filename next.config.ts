import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '0' // Modern browsers use CSP; 0 prevents rare XSS-leak bugs
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://static.cloudflareinsights.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "img-src 'self' data: https: blob:; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "worker-src 'self' blob:; " +
              // Added Supabase & MediaStream for your AI audio modules
              "media-src 'self' blob: https://cqtluudfmigefqphmfbb.supabase.co mediastream:; " +
              // connect-src allows the AI to "talk" to the servers
              "connect-src 'self' https://vercel.live https://*.supabase.co wss://*.supabase.co wss://*.googleapis.com https://*.googleapis.com;"
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            // ENABLED: microphone and speaker-selection for AI interaction
            // ENABLED: autoplay so AI can speak back to the user
            value: 'camera=(), microphone=(self), speaker-selection=(self), autoplay=(self), geolocation=(), browsing-topics=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
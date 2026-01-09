/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kmwinrwqavqvclnevyxp.supabase.co'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Experimental features for better performance
  // Note: optimizeCss requires 'critters' package - removed for now
  // experimental: {
  //   optimizeCss: true,
  // },
  // Removed webpack config to avoid chunk loading issues
  // Let Next.js handle webpack configuration automatically
  // Simplified headers to avoid interfering with dev server
  // Headers can be re-enabled for production if needed
  async headers() {
    // Only add headers in production to avoid dev server issues
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig


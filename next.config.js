/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use empty turbopack config to allow Turbopack (Next.js 16 default)
  turbopack: {},
  // pdf-lib + pdfkit reach into binary asset paths that Turbopack would
  // otherwise rewrite into the build cache. Marking them serverExternal
  // forces Next.js to require them from node_modules at runtime.
  serverExternalPackages: ["pdfkit", "pdf-lib", "@pdf-lib/fontkit"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kmwinrwqavqvclnevyxp.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Webpack configuration to fix module loading issues (used when --webpack flag is passed)
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      })
    );
    return config;
  },
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
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
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


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable instrumentation for global error suppression
  experimental: {
    instrumentationHook: true,
  },
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
  // Webpack configuration to fix module loading issues
  webpack: (config, { isServer, webpack }) => {
    // Fix for "Cannot read properties of undefined (reading 'call')" errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Ensure proper module resolution
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };
    
    // Fix for dynamic import issues with React Server Components
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    // Add error handling for undefined factory functions
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


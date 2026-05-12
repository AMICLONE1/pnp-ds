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
  // Security headers applied to every response. Defined here (not in
  // middleware) so Vercel sets them at the edge — including on static
  // assets that never hit our middleware.
  async headers() {
    // CSP: built once and reused. Allows Cashfree's payment SDK (which
    // spawns a blob worker), Supabase, Vercel image optimization, and
    // self-hosted scripts. Tighten further once we drop unsafe-eval /
    // unsafe-inline (Next.js still needs them for hydration/dev).
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://sdk.cashfree.com https://*.cashfree.com https://*.cashfree.net",
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://*.cashfree.com https://*.cashfree.net wss://*.cashfree.com https://api.dicebear.com",
      "frame-src 'self' https://*.cashfree.com https://*.cashfree.net",
      "object-src 'none'",
      "base-uri 'self'",
      // Cashfree's Drop-in checkout posts a form to its hosted session URL
      // (sandbox.cashfree.com / payments.cashfree.com). 'self' alone would
      // block this and the payment silently fails in the browser console.
      "form-action 'self' https://*.cashfree.com https://*.cashfree.net",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      // HSTS only meaningful on real HTTPS — safe to set unconditionally,
      // browsers ignore it on http:// and on localhost.
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
}

module.exports = nextConfig


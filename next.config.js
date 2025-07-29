/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  // Désactiver les diagnostics webhint et Edge Tools
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Désactiver les warnings de style inline pour le branding dynamique
      config.stats = {
        ...config.stats,
        warnings: false,
      };

      // Ignorer les diagnostics webhint
      config.ignoreWarnings = [
        /no-inline-styles/,
        /CSS inline styles should not be used/,
        /webhint/i,
        /edge.*tools/i,
      ];
    }
    return config;
  },
  // Headers pour désactiver Edge DevTools
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

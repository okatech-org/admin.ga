/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: { appDir: true } supprimé - activé par défaut dans Next.js 14.x
  typescript: {
    // Réactivation des vérifications TypeScript pour la qualité du code
    ignoreBuildErrors: false,
  },
  eslint: {
    // Réactivation des vérifications ESLint pour la qualité du code
    ignoreDuringBuilds: false,
  },
  output: 'standalone',
  // Configuration webpack optimisée pour Next.js 14.x
  webpack: (config, { dev, isServer }) => {
    // Optimisation du cache webpack avec chemin absolu
    const path = require('path');
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(process.cwd(), '.next/cache/webpack'),
    };

    if (dev && !isServer) {
      // Configuration des warnings pour le développement
      config.stats = {
        ...config.stats,
        warnings: false,
      };

      // Ignorer les warnings spécifiques et erreurs de diagnostic
      config.ignoreWarnings = [
        /no-inline-styles/,
        /CSS inline styles should not be used/,
        /webhint/i,
        /edge.*tools/i,
        /Microsoft Edge Tools/i,
        /no-bom/i,
        /Content could not be fetched/i,
        // Ignorer les avertissements de dépendances de résolution
        /Critical dependency:/,
        /Cannot resolve dependency/,
        // Ignorer les erreurs de fichiers temporaires supprimés
        /diagnostic-imports/i,
        /debug-organismes/i,
      ];
    }

    // Optimisation des performances - configuration sécurisée pour Next.js
    if (config.optimization?.splitChunks) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Configuration vendor sécurisée pour Next.js
          default: false,
          vendors: false,
        },
      };
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

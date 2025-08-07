const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour le build de production optimisé
  output: 'standalone',

  // Configuration des images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'administration.ga',
      },
      {
        protocol: 'https',
        hostname: 'www.administration.ga',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Configuration expérimentale pour les performances
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@prisma/client'
    ],
  },

  // Configuration du bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations pour la production
    if (!dev) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      }
    }

    // Configuration pour Prisma
    config.externals.push({
      '@prisma/client': 'commonjs @prisma/client',
    })

    return config
  },

  // En-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
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
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.gemini.google.com https://generativelanguage.googleapis.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  },

  // Redirections pour la sécurité
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/super-admin/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/super-admin/dashboard',
        permanent: true,
      }
    ]
  },

  // Configuration du serveur
  serverRuntimeConfig: {
    // Configurations privées du serveur
  },

  // Configuration publique
  publicRuntimeConfig: {
    // Variables accessibles côté client
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Configuration des rewrites pour l'API
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites pour l'API interne
        {
          source: '/api/v1/:path*',
          destination: '/api/:path*'
        },
        {
          source: '/api/health',
          destination: '/api/health/route',
        }
      ],
      afterFiles: [
        // Rewrites après la résolution des fichiers
      ],
      fallback: [
        // Fallbacks pour les routes non trouvées
      ]
    }
  },

  // Configuration ESLint
  eslint: {
    // Ignore les erreurs ESLint en production pour accélérer les builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },

  // Configuration TypeScript
  typescript: {
    // Ignore les erreurs TypeScript en production si nécessaire
    ignoreBuildErrors: false,
  },

  // Configuration des variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration des polyfills pour les anciennes versions de navigateurs
  transpilePackages: [
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    'lucide-react'
  ],

  // Configuration pour l'analyse du bundle
  ...(() => {
    if (process.env.ANALYZE === 'true') {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
      })
      return withBundleAnalyzer({})
    }
    return {}
  })(),

  // Configuration pour le monitoring des performances
  poweredByHeader: false,
  generateEtags: true,
  compress: true,

  // Configuration pour les builds incrémentaux
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "your-org-slug",
    project: "your-project-slug",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);

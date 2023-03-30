const { withSentryConfig } = require('@sentry/nextjs')
const packageJson = require('./package.json')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

// Some packages export a lot of modules in a single index file. To avoid them being compiled
// next has added native support for modularize import transform
// https://nextjs.org/docs/advanced-features/compiler#modularize-imports
// https://github.com/vercel/next.js/tree/canary/examples/modularize-imports
const modularizeImports = {
  'date-fns': { transform: 'date-fns/{{member}}' },
  'chart.js': { transform: 'chart.js/{{member}}' },
}

/**
 * For faster dev UX, server dependencies do not need to be bundled.
 * Except those that are expected to be bundled for compilation features.
 */
const alwaysBundledPackages = new Set(['next', 'server-only'])
const externalServerPackagesForFasterDevUx =
  process.env.NODE_ENV === 'development'
    ? [
        ...Object.keys(packageJson.dependencies),
        ...Object.keys(packageJson.devDependencies),
      ].filter((packageName) => !alwaysBundledPackages.has(packageName))
    : []

const nextConfig = {
  // FIXME standalone does not support app directory for now
  // output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@mss/emails'],
  experimental: {
    appDir: true,
    // See https://beta.nextjs.org/docs/api-reference/next.config.js#servercomponentsexternalpackages
    serverComponentsExternalPackages: [
      'nanoid',
      'mjml',
      'mjml-core',
      ...externalServerPackagesForFasterDevUx,
    ],
  },
  modularizeImports,
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  sentry: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    tunnelRoute: '/monitoring',
    widenClientFileUpload: true,
    hideSourceMaps: true,
  },
  eslint: {
    // Lints are checked in other parts of the build process
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checks are done in other parts of the build process
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client bundling

      return config
    }

    // Server bundling

    // Mjml cannot be bundled as it uses dynamic requires
    // Only put library required on the server in externals as they would not be available in client
    config.externals.push('mjml', 'mjml-core')

    return config
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules/@gouvfr/dsfr')],
  },
}

// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  silent: isDev, // Suppresses all logs
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)

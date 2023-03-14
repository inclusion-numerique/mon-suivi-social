const { withSentryConfig } = require('@sentry/nextjs')
const packageJson = require('./package.json')
const bundleAnalyzer = require('@next/bundle-analyzer')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: false,
  openAnalyzer: false,
})

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
}

// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
}

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions),
)

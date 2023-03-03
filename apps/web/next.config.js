const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // FIXME standalone does not support app directory for now
  // output: 'standalone',
  reactStrictMode: true,
  experimental: {
    appDir: true,
    // See https://beta.nextjs.org/docs/api-reference/next.config.js#servercomponentsexternalpackages
    serverComponentsExternalPackages: ['@mss/emails', 'mjml', 'mjml-core'],
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
    // Lints are done in other parts of the build process
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checks are done in other parts of the build process
    ignoreBuildErrors: true,
  },
}

// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)

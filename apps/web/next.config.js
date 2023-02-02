const nextConfig = {
  // FIXME standalone does not support app directory for now
  // output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@mss/emails'],
  experimental: {
    appDir: true,
  },
  sentry: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    tunnelRoute: '/monitoring',
  },
  eslint: {
    // Lints are done in other parts of the build process
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checks are done in other parts of the build process
    ignoreBuildErrors: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // Mjml cannot be bundled as it uses dynamic requires
    // Only put library required on the server in externals as they would not be available in client
    config.externals.push('mjml', 'mjml-core')

    return config
  },
}

module.exports = nextConfig

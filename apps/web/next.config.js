const nextConfig = {
  // FIXME standalone does not support app directory for now
  output: 'standalone',
  reactStrictMode: true,
  // transpilePackages: ['@acme/ui', 'lodash-es'],
  experimental: {
    appDir: true,
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

module.exports = nextConfig

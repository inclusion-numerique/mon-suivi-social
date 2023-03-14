const { withSentryConfig } = require('@sentry/nextjs')
const packageJson = require('./package.json')
const bundleAnalyzer = require('@next/bundle-analyzer')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: false,
  openAnalyzer: false,
})

const isDev = process.env.NODE_ENV === 'development'

/**
 * Improve dev compilation times by not compiling everything when importing a module
 */
const modularizeImports = isDev
  ? {
      // TODO What module are we using that could benefit from this ?
      lodash: {
        transform: 'lodash/{{member}}',
      },
    }
  : {}

// https://webpack.js.org/concepts/plugins/
// class DebugCompiledModulesPlugin {
//   apply(compiler) {
//     console.log('DebugCompiledModulesPlugin apply called')
//     // https://webpack.js.org/api/compiler-hooks/
//     compiler.hooks.compilation.tap(
//       'DebugCompiledModulesPlugin',
//       (compilation) => {
//         // https://webpack.js.org/api/compilation-object/
//         compilation.hooks.optimizeChunkAssets.tap(
//           'DebugCompiledModulesPlugin',
//           (chunk) => {
//             // console.log('CHUNK', chunk.id)
//             // explore chunk
//             // chunk.getModules().forEach((module) => {
//             //   console.log('MOD', module.resource, module.request, module.path)
//             //   explore modules
//             // })
//           },
//         )
//       },
//     )
//   }
// }

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
    if (isDev) {
      // config.plugins.push(new DebugCompiledModulesPlugin())
    }
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
  silent: isDev, // Suppresses all logs
}

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions),
)

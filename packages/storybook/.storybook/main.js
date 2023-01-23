const { parse } = require('dotenv')
const { resolve } = require('path')
const { readFileSync, existsSync } = require('fs')
const dotenvVars = () => {
  const dotenvFile = resolve(__dirname, '../../../.env')
  if (!existsSync(dotenvFile)) {
    return null
  }
  return parse(readFileSync(dotenvFile))
}
// See https://github.com/storybookjs/storybook/blob/111edc3929eb8afff1b58285b0b9c49dd493ae85/code/frameworks/nextjs/README.md
module.exports = {
  stories: [
    '../../../apps/web/src/**/*.mdx',
    '../../../apps/web/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: resolve(__dirname, '../../../apps/web/next.config.js'),
    },
  },
  staticDirs: ['../../../apps/web/public'],

  docs: {
    docsPage: true,
    autodocs: true,
  },
  env: (config) => ({
    ...config,
    ...dotenvVars(),
  }),
}

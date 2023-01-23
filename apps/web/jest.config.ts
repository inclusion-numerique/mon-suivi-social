import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(__dirname, '../../.env') })

// Next config does not work with es modules
// nextJest()()().then((config) => console.log('NEXT CONFIG', config, config.transform))

/**
 * If you have a babel error in jest test environment
 * add the faulty package to this list
 */
const transformIgnorePackages = [
  'uuid',
  'nanoid',
  'undici',
  'node-fetch',
  'crypto',
  'data-uri-to-buffer',
  'fetch-blob',
  'formdata-polyfill',
  '@aws-sdk/middleware-retry',
  '@aws-sdk/client-s3',
  'axios',
]

const packagesNamesPattern = transformIgnorePackages.join('|')

const nodeModulesTransformIgnorePattern = `node_modules/(?!${packagesNamesPattern})`

const config = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transformIgnorePatterns: [
    nodeModulesTransformIgnorePattern,
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: ['<rootDir>/../../packages/test/src/jest.setup.ts'],
  testMatch: [
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.integration.ts',
    '**/*.integration.tsx',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$':
      '<rootDir>/node_modules/next/dist/build/jest/object-proxy.js',
    '^.+\\.(css|sass|scss)$':
      '<rootDir>/node_modules/next/dist/build/jest/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$':
      '<rootDir>/node_modules/next/dist/build/jest/__mocks__/fileMock.js',
    '^.+\\.(svg)$':
      '<rootDir>/node_modules/next/dist/build/jest/__mocks__/fileMock.js',
    '^@mss/web/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  watchPathIgnorePatterns: ['/.next/'],

  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': [
      '<rootDir>/node_modules/next/dist/build/swc/jest-transformer.js',
      {
        nextConfig: undefined,
        jsConfig: undefined,
        resolvedBaseUrl: undefined,
        hasServerComponents: undefined,
        isEsmProject: false,
        pagesDir: undefined,
      },
    ],
  },
}

export default config

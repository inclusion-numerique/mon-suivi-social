import { testDotenvConfig } from '../../packages/test/src/packageJestConfig'
import { createNodeModulesTransformIgnorePattern } from '../../packages/test/src/transformIgnore'

testDotenvConfig()

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

// TODO Try the next env config
const config = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transformIgnorePatterns: [
    createNodeModulesTransformIgnorePattern(transformIgnorePackages),
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

  // TODO Remove ts-jest and test a tsx composant
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

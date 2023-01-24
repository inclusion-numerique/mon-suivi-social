import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { createNodeModulesTransformIgnorePattern } from './transformIgnore'

const dotenvFile = resolve(__dirname, '../../../.env')

export const testDotenvConfig = () => {
  dotenv.config({ path: dotenvFile })
}

export const packageJestConfig = ({
  transformIgnorePackages = [],
  testPathIgnorePatterns = [],
}: {
  transformIgnorePackages?: string[]
  testPathIgnorePatterns?: string[]
}) => {
  testDotenvConfig()

  return {
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    transform: {
      '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    transformIgnorePatterns: [
      createNodeModulesTransformIgnorePattern(transformIgnorePackages),
    ],
    setupFilesAfterEnv: ['<rootDir>/../../packages/test/src/jest.setup.ts'],
    testMatch: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.integration.ts',
      '**/*.integration.tsx',
    ],
    moduleNameMapper: {
      '^@mss/web/(.*)$': '<rootDir>/../../apps/web/src/$1',
      '^@mss/cli/(.*)$': '<rootDir>/../../apps/cli/src/$1',
      '^@mss/cdk/(.*)$': '<rootDir>/../../packages/cdk/src/$1',
      '^@mss/e2e/(.*)$': '<rootDir>/../../packages/e2e/src/$1',
      '^@mss/emails/(.*)$': '<rootDir>/../../packages/emails/src/$1',
      '^@mss/lint/(.*)$': '<rootDir>/../../packages/lint/src/$1',
      '^@mss/storybook/(.*)$': '<rootDir>/../../packages/storybook/src/$1',
      '^@mss/test/(.*)$': '<rootDir>/../../packages/test/src/$1',
    },
    testPathIgnorePatterns: [
      '<rootDir>/node_modules/',
      ...testPathIgnorePatterns,
    ],
    testEnvironment: 'node',
  }
}

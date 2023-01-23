import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(__dirname, '../../.env') })

/**
 * If you have a babel error in jest test environment
 * add the faulty package to this list
 */
const transformIgnorePackages: string[] = []

const packagesNamesPattern = transformIgnorePackages.join('|')

const nodeModulesTransformIgnorePattern = `node_modules/(?!${packagesNamesPattern})`

const config = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    nodeModulesTransformIgnorePattern,
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
    '^@mss/emails/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',

}

export default config

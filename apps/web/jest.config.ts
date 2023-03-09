import { packageJestConfig } from '../../packages/test/src/packageJestConfig'

export default packageJestConfig({
  transformIgnorePackages: [],
  testPathIgnorePatterns: ['<rootDir>/.next/'],
  mockableFilePatterns: [
    'utils/generateContentSecurityPolicyScriptNonce.ts$',
    'utils/somethingElse.ts$',
  ],
})

import { packageJestConfig } from '../../packages/test/src/packageJestConfig'

export default packageJestConfig({
  testPathIgnorePatterns: ['<rootDir>/tests', '<rootDir>/tests-examples'],
})

import * as dotenv from 'dotenv'
import {resolve} from 'path'
import {createNodeModulesTransformIgnorePattern} from "./src/transformIgnore";

dotenv.config({path: resolve(__dirname, '../../.env')})

const config = {
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    transformIgnorePatterns: [
        createNodeModulesTransformIgnorePattern([]),
    ],
    setupFilesAfterEnv: ['<rootDir>/../../packages/test/src/jest.setup.ts'],
    testMatch: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.integration.ts',
        '**/*.integration.tsx',
    ],
    moduleNameMapper: {
        '^@mss/test/(.*)$': '<rootDir>/src/$1',
    },
    testPathIgnorePatterns: ['/node_modules/'],
    testEnvironment: 'node',
}

export default config

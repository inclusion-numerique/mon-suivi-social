// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'turbo',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    // Use function hoisting to improve code readability
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    // Null and undefined have different intent in our code, especially for integration with prisma and trpc
    'unicorn/no-null': 'off',
    // We use typescript default values and types
    'react/require-default-props': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
  },
  parserOptions: {
    sourceType: 'module',
    // eslint-disable-next-line no-path-concat, unicorn/prefer-module
    project: `${__dirname}/../../../tsconfig.eslint.json`,
  },
}

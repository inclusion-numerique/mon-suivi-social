// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:json/recommended',
    'turbo',
    'airbnb/base',
    'airbnb/hooks',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  rules: {
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    // We want this on, but a lot of libraries we integrate with need commonJs (eslint, next config ...)
    'unicorn/prefer-module': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    // Null and undefined have different intent in our code, especially for integration with prisma and trpc
    'unicorn/no-null': 'off',
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
  },
  overrides: [
    {
      files: '**/*.+(ts|tsx)',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // eslint-disable-next-line no-path-concat, unicorn/prefer-module
        project: `${__dirname}/../../../tsconfig.eslint.json`,
      },
      plugins: ['@typescript-eslint', 'import', 'prettier'],
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
        'no-restricted-syntax': 'off',
        // Module resolve leads to false negatives in monorepo, typescript compiler will handle any error
        'import/no-unresolved': [2, { ignore: ['^@mss/'] }],
        'import/prefer-default-export': 'off',
        'react/jsx-props-no-spreading': [
          'error',
          {
            custom: 'ignore',
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
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
    },
  ],
}

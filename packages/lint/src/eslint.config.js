module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['turbo', 'eslint:recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  parserOptions: {
    sourceType: 'module',
  },
  overrides: [
    {
      files: '*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'import', 'prettier'],
      overrides: [
        {
          files: ['**/*.ts'],
          extends: [
            'turbo',
            'airbnb-typescript/base',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:import/typescript',
            'prettier',
          ],
          rules: {},
        },
      ],
    },
  ],
}

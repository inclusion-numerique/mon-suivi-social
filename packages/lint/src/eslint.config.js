// module.exports = {
//   root: true,
//   extends: [
//     'turbo',
//     'airbnb-typescript/base',
//     'prettier',
//     'next/core-web-vitals',
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:@typescript-eslint/eslint-recommended',
//     'plugin:@typescript-eslint/recommended-requiring-type-checking',
//     'plugin:prettier/recommended',
//   ],
//   rules: {
//     'interface-name': 'off',
//     'no-implicit-dependencies': 'off',
//     'no-submodule-imports': 'off',
//     'no-trailing-spaces': 'error',
//     'object-literal-sort-keys': 'off',
//   },
// }

module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['turbo', 'eslint:recommended', 'prettier', 'next'],
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
            'next',
          ],
          rules: {},
        },
      ],
    },
  ],
}

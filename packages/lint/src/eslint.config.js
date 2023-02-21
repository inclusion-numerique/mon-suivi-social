module.exports = {
  root: true,
  extends: ['turbo', 'prettier', 'next/core-web-vitals'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'interface-name': 'off',
    'no-console': 'warn',
    'no-implicit-dependencies': 'off',
    'no-submodule-imports': 'off',
    'no-trailing-spaces': 'error',
    'object-literal-sort-keys': 'off',
    'react/jsx-key': 'off',
  },
}

const path = require('path');

module.exports = {
  // So parent files don't get applied
  root: true,
  globals: {
    preval: false,
  },
  extends: [
    'airbnb-typescript',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['babel', 'import', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2019',
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', path.resolve(__dirname, './src')],
        ],
        extensions: ['.ts', '.js', '.jsx', '.tsx', '.png'],
      },
    },
  },
  rules: {
    'prefer-object-spread': 'error',
    'no-underscore-dangle': 'off',
    'consistent-this': ['error', 'self'],
    'max-len': [
      'error',
      100,
      2,
      {
        ignoreUrls: true,
      },
    ], // airbnb is allowing some edge cases
    'no-console': ['error', { allow: ['error'] }], // airbnb is using warn

    // Note, export default interface triggers error for ';', see https://github.com/typescript-eslint/typescript-eslint/issues/123
    'no-extra-semi': 'off',
    semi: ['error', 'always'],

    'jest/valid-expect': 'off', // for jest-expect-message

    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-floating-promises': 'error',

    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prettier/prettier': ['error', { singleQuote: true, arrowParens: 'avoid' }],
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/no-cycle': 'off',
    'no-void': 'off',
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off'
  },
};

'use strict';

module.exports = {
  extends: [
    'standard',
    'plugin:ramda/recommended',
    'plugin:prettier/recommended',
    'prettier/standard'
  ],
  plugins: ['ramda', 'sort-destructure-keys'],
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    browser: false,
    es2020: true,
    jest: true,
    node: true
  },
  rules: {
    'no-extra-semi': 2,
    semi: [2, 'always'],
    strict: ['error', 'global']
  }
};

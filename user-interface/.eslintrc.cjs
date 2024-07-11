module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['tsconfig.json'],
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-console': 1,
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'react/button-has-type': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}

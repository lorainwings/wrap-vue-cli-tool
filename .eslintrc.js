module.exports = {
  extends: ['eslint:recommended'],
  root: true,
  env: {
    node: true
  },
  rules: {
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-lonely-if': 'warn',
    'array-callback-return': 'off',
    'new-cap': 'off',
    'linebreak-style': 'off',
    'func-names': 'error',
    'no-param-reassign': ['error', { props: false }],
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false
      }
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  plugins: ['babel'],
  env: {
    node: true,
    es6: true
  }
};

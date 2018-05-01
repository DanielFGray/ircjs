module.exports = {
  extends: ['airbnb'],
  env: {
    node: true,
  },
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-unexpected-multiline': 'error',
    'no-nested-ternary': 'off',
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false,
        overrides: {
          '!': true,
        },
      },
    ],
    'no-unused-vars': ['warn'],
    'arrow-parens': ['error', 'as-needed'],
  },
}

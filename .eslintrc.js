const baseRules = {
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/ban-ts-ignore': 0,
  '@typescript-eslint/ban-ts-comment': 0,
  indent: ['error', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'import/no-mutable-exports': 0,
  'no-unused-vars': ['error', { vars: 'local', args: 'after-used', ignoreRestSiblings: true }],
  'no-cond-assign': [2],
  'no-console': 'off',
  'vue/no-v-html': 'off',
  'prettier/prettier': [
    'warn',
    {
      singleQuote: true,
      trailingComma: 'none',
      semi: true,
      bracketSpacing: true,
      vueIndentScriptAndStyle: false,
      printWidth: 130
    }
  ]
};

module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    browser: true
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: baseRules,
  ignorePatterns: ['./types/types.ts']
};

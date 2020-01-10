module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    semi: 0,
    'comma-dangle': [2, 'only-multiline'],
    // see @typescript-eslint/no-unused-vars below
    'no-unused-vars': 0,
    'space-before-function-paren': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-this-alias': [2, { allowedNames: ['vm'] }],
    '@typescript-eslint/no-use-before-define': [2, { functions: false }],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        // 允许声明未使用变量
        vars: 'local',
        // 在使用的参数之前定义的不检测
        args: 'none',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.vue'],
      },
    },
  },
  env: {
    node: true,
  },
};

module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config-typescript'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": [2, {
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none"
    }],
    // 关闭语句强制分号结尾
    "semi": [0],
    //空行最多不能超过2行
    "no-multiple-empty-lines": [0, { "max": 2 }],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    //换行使用CRLF
    'linebreak-style': [2, 'windows'],
    //允许非default export
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': [2, { ignore: ['vue', 'vuex'] }],
    'import/core-modules': ['vue', 'vuex'],
    'comma-dangle': [2, 'only-multiline'],
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'max-len': 0
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': [".js", ".ts", ".vue"]
      }
    }
  },
  // parserOptions: {
  //   parser: 'babel-eslint',
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     legacyDecorators: true
  //   }
  // },
  env: {
    node: true
  },
};

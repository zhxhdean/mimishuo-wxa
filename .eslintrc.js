// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  // extends: 'airbnb-base',
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    // 'html',
    'async-await'
  ],
  // check if imports actually resolve
  // 'settings': {
  //   'import/resolver': {
  //     'webpack': {
  //       'config': 'build/webpack.base.conf.js'
  //     }
  //   }
  // },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],

    'async-await/space-after-async': 0,
    'async-await/space-after-await': 0,
    'import/no-unresolved': 0,
    'no-console': 'off',

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getPage: true,
    getCurrentPages: true,
    requirePlugin: true
  }
}

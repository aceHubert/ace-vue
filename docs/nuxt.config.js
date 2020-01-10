/* eslint-disable space-before-function-paren */
module.exports = {
  mode: 'universal',
  srcDir: 'src/',
  server: {
    port: 8000,
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['./plugins/useHooks.ts'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    babel: {
      // envName: server, client, modern
      presets({ _envName }) {
        return [
          [
            '@nuxt/babel-preset-app',
            {
              corejs: { version: 3 },
            },
          ],
        ];
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(_config, _ctx) {
      // do something
    },
  },
};

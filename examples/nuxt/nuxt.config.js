const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const pkg = require('./package');

module.exports = {
  mode: 'spa',
  rootDir: 'src/',
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
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
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [],

  /*
   ** Build configuration
   */
  build: {
    transpile: [],

    /*
     ** You can extend webpack config here
     */
    extend(config, _ctx) {
      Object.assign(config.resolve.alias, {
        '@acevue/styles': resolveApp('packages/acevue-styles/src'),
        '@acevue/utils': resolveApp('packages/acevue-utils/src'),
      });
    },
  },
};

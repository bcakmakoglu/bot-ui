import type { NuxtConfig } from '@nuxt/types';

export const NuxtBuildConfig: NuxtConfig['build'] = {
  transpile: ['vuex-module-decorators'],
  plugins: [],
  extractCSS: true,
  postcss: true,
  analyze: process.env.TARGET_STAGE === 'dev',
  loadingScreen: process.env.TARGET_STAGE === 'dev',
  indicator: true,
  splitChunks: {
    commons: true,
    pages: true
  },
  babel: { compact: true },
  extend(config, { isDev, isClient, loaders: { vue } }) {
    config.node = {
      fs: 'empty'
    };
    if (isDev) {
      config.mode = 'development';
      config.devtool = 'source-map';
    }
    if (isClient) {
      if (config.optimization?.splitChunks) {
        config.optimization.splitChunks.maxSize = 200000;
      }
      if (vue) {
        vue.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href'
        };
      }
    }
  }
};

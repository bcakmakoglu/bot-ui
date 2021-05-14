import type { NuxtConfig } from '@nuxt/types';
import {
  NuxtApolloConfig,
  NuxtBuildConfig,
  NuxtBuildModules,
  NuxtModules,
  NuxtHeaderConfig,
  NuxtPluginsConfig,
  NuxtRouterConfig,
  NuxtServerMiddlewareConfig
} from './config';

const dev = process.env.TARGET_STAGE === 'dev' || true;
const ssr = process.env.SSR === 'true' || false;

const config = {
  dev,

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr,

  telemetry: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: ssr ? 'server' : 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: NuxtHeaderConfig,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@fortawesome/fontawesome-free/css/all.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: NuxtPluginsConfig,

  // Auto import components (https://go.nuxtjs.dev/config-components)
  // if you're using true instead of paths make sure you understand that component names are created in accordance to directory structure
  // i.e. /components/Loading/Sky -> <loading-sky />
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: NuxtBuildModules,

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: NuxtModules,

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: NuxtBuildConfig,

  // Hosting
  server: {
    host: '0.0.0.0',
    port: '8085'
  },

  // Vue-Router Configuration
  router: NuxtRouterConfig,

  layoutTransition: {
    name: 'default',
    mode: 'out-in'
  },

  pageTransition: {
    name: 'slide',
    mode: 'out-in'
  },

  // Loading indicator
  loading: {
    color: '#2cc158',
    throttle: 200,
    height: '6px',
    continuous: true
  },

  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
        exclude: ['node_modules/*', 'types']
      }
    }
  },

  eslint: {
    exclude: 'types/*'
  },

  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  publicRuntimeConfig: {},

  serverMiddleware: NuxtServerMiddlewareConfig,

  apollo: NuxtApolloConfig
} as NuxtConfig;

// some dev only options
if (process.env.TARGET_STAGE === 'dev') {
  // config.buildModules?.push('~/modules/ngrok', '~/modules/bot-api');
}

export default config;

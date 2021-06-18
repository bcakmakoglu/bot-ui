import type { NuxtConfig } from '@nuxt/types';
import { ModuleConfiguration } from '@nuxtjs/sentry/types';
import {
  NuxtBuildConfig,
  NuxtBuildModules,
  NuxtModules,
  NuxtHeaderConfig,
  NuxtToasterConfig,
  PurgeCssConfig,
  NuxtAuthConfig
} from './config';

const dev = process.env.TARGET_STAGE === 'dev' || false;
const ssr = process.env.SSR === 'true' || false;
const target = process.env.RENDER_TARGET || 'static';

const config = {
  dev,

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr,

  telemetry: !dev,

  // Target (https://go.nuxtjs.dev/config-target)
  target,

  modern: !dev,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: NuxtHeaderConfig,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '~/plugins/vuex-persisted-state/persisted.ts'
    },
    {
      src: '~/plugins/vuera/index.ts'
    }
  ],

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

  // Vue-Router Configuration
  router: {
    base: '/',
    routeNameSplitter: '/',
    mode: 'history',
    middleware: 'auth'
  },

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
      aggregateTimeout: 500,
      poll: 1000
    }
  },

  publicRuntimeConfig: {
    graphQlEndpoint: process.env.GRAPHQL_ENDPOINT,
    stage: process.env.TARGET_STAGE || 'dev'
  },

  serverMiddleware: [],

  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo/config.ts'
    }
  },

  toast: NuxtToasterConfig,

  vuetify: {
    treeShake: !dev,
    customVariables: ['~/assets/scss/variables.scss'],
    optionsPath: './vuetify.options.js',
    defaultAssets: false
  } as any,

  purgeCSS: PurgeCssConfig,

  webfontloader: {
    google: {
      families: ['Roboto']
    }
  },

  axios: {
    baseURL: process.env.GRAPHQL_ENDPOINT // Used as fallback if no runtime config is provided
  },

  auth: NuxtAuthConfig,

  sentry: {
    config: {
      environment: process.env.TARGET_STAGE
    },
    dsn: process.env.SENTRY_DSN,
    lazy: true,
    tracing: {
      tracesSampleRate: 1.0,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ['mount', 'update'],
          timeout: 2000,
          trackComponents: true
        }
      }
    }
  } as ModuleConfiguration,

  pwa: {
    icon: {
      source: '~/static/icon.png'
    },
    meta: {
      name: '@braks bot-ui',
      lang: 'en',
      theme_color: 'dark'
    },
    manifest: {
      name: '@braks bot-ui',
      lang: 'en',
      useWebmanifestExtension: false,
      theme_color: 'dark'
    }
  },

  robots: {
    UserAgent: '*',
    Disallow: '/login'
  }
} as NuxtConfig;

// some dev only options
if (process.env.TARGET_STAGE === 'dev') {
  // Hosting
  config.server = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || '8085'
  };
  // config.buildModules?.push('~/modules/ngrok', '~/modules/bot-api');
}

export default config;

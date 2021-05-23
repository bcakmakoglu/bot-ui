import { Plugin } from '@nuxt/types';
import { Inject } from '@nuxt/types/app';
import { SessionManager } from './manager';

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $sm: SessionManager;
    $sessionManager: SessionManager;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $sm: SessionManager;
    $sessionManager: SessionManager;
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $sm: SessionManager;
    $sessionManager: SessionManager;
  }
}

const sessionManagerPlugin: Plugin = ({ app, $apolloHelpers, $toast, redirect, store, $config }, inject: Inject) => {
  const sessionManager = new SessionManager(
    app.apolloProvider.defaultClient,
    $apolloHelpers,
    $toast,
    redirect,
    store,
    $config.refreshInterval,
    $config.graphQlEndpoint
  );

  inject('sessionManager', sessionManager);
  inject('sm', sessionManager);
};

export default sessionManagerPlugin;

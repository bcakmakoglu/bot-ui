import createPersistedState from 'vuex-persistedstate';
import * as Cookie from 'js-cookie';
import cookie from 'cookie';
import { Plugin } from '@nuxt/types';

const client = process.client || process.browser;

function storage(req: Record<string, any>, res: any) {
  if (process.env.SSR) {
    return {
      getItem: (key: string) => {
        // See https://nuxtjs.org/guide/plugins/#using-process-flags
        if (!client) {
          const parsedCookies = cookie.parse(req.headers.cookie || '');
          return parsedCookies[key];
        } else {
          return Cookie.getJSON(key);
        }
      },
      setItem: (key: string, state: string) => {
        client || process.static
          ? Cookie.set(key, state, { expires: 7, secure: false, path: '/' })
          : res.setHeader('Set-Cookie', cookie.serialize(key, state, { secure: false, path: '/' }));
      },
      removeItem: (key: string) => Cookie.remove(key)
    };
  } else {
    return localStorage;
  }
}

const persistedStatePlugin: Plugin = ({ store, req, res }) => {
  createPersistedState({
    key: 'storage',
    paths: ['user'],
    storage: storage(req, res)
  })(store);
};

export default persistedStatePlugin;

import { RefreshController, RefreshScheme } from '@nuxtjs/auth-next/dist/runtime';
import { HTTPResponse } from '@nuxtjs/auth-next';
import consolaGlobalInstance from 'consola';
import login from './login.graphql';
import refresh_token from './refresh_token.graphql';
import get_user from './get_user.graphql';

export default class HasuraScheme extends RefreshScheme {
  constructor(auth, options) {
    super(auth, options);

    this.refreshController = new RefreshController(this);
  }

  async refreshTokens(): Promise<HTTPResponse | void> {
    const $apollo = this.$auth.ctx.app.apolloProvider.defaultClient;
    try {
      const {
        data: {
          refreshToken: { accessToken }
        }
      } = await $apollo.mutate({
        mutation: refresh_token
      });
      if (accessToken) {
        return this.$auth.ctx.$apolloHelpers.onLogin(accessToken);
      }
    } catch (e) {
      consolaGlobalInstance.debug(e);
    }

    this.$auth.ctx.$toast.error('There was an issue. We will have to log you out, sorry.');
    await this.$auth.ctx.$apolloHelpers.onLogout();
    await this.$auth.redirect('/login');
  }

  async login(request) {
    const $apollo = this.$auth.ctx.app.apolloProvider.defaultClient;
    try {
      const {
        data: {
          login: { id, accessToken, refreshToken }
        }
      } = await $apollo.mutate({
        mutation: login,
        variables: {
          data: {
            username: request.data.username,
            password: request.data.password
          }
        }
      });
      const user = {
        id,
        username: request.data.username
      };
      if (accessToken) {
        this.$auth.$storage.setUniversal('user', user);
        await this.$auth.ctx.$apolloHelpers.onLogin(accessToken);
        await this.$auth.setUserToken(accessToken, refreshToken);
        return {
          status: 200
        } as HTTPResponse;
      }
    } catch (e) {
      console.debug(e);
    }

    this.$auth.callOnError(undefined, { method: 'login' });
    return { status: 500 } as HTTPResponse;
  }

  // Override `fetchUser` method of `local` scheme
  async fetchUser() {
    const $apollo = this.$auth.ctx.app.apolloProvider.defaultClient;

    // Token is required but not available
    if (!this.check().valid) {
      return;
    }

    const {
      data: { users_by_pk }
    } = await $apollo.query({
      query: get_user,
      variables: {
        id: (this.$auth.$storage.getUniversal('user') as Record<string, any>).id
      }
    });

    if (users_by_pk) {
      this.$auth.setUser(users_by_pk);

      return { status: 200 } as HTTPResponse;
    }

    this.$auth.callOnError(undefined, { method: 'fetchUser' });
    return { status: 500 } as HTTPResponse;
  }

  async logout(): Promise<void> {
    consolaGlobalInstance.info('Logging out!', this.$auth.user);
    this.$auth.$storage.removeUniversal('user');
    await this.$auth.ctx.$apolloHelpers.onLogout();
    await super.logout();
  }
}

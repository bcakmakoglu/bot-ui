import { RefreshController, RefreshScheme } from '@nuxtjs/auth-next/dist/runtime';
import { HTTPResponse } from '@nuxtjs/auth-next';
import { ApolloClient } from 'apollo-client';
import consolaGlobalInstance from 'consola';
import login from './login.graphql';
import logout from './logout.graphql';
import refresh_token from './refresh_token.graphql';
import get_user from './get_user.graphql';

export default class HasuraScheme extends RefreshScheme {
  $apollo: ApolloClient<any>;

  constructor(auth, options) {
    super(auth, options);

    this.$apollo = auth.ctx.app.apolloProvider.defaultClient;
    this.refreshController = new RefreshController(this);
  }

  async refreshTokens(): Promise<HTTPResponse | void> {
    try {
      const {
        data: {
          refreshToken: { accessToken }
        }
      } = await this.$apollo.mutate({
        mutation: refresh_token
      });
      if (accessToken) {
        await this.$auth.ctx.$apolloHelpers.onLogin(accessToken);
        await this.setUserToken(accessToken, this.refreshToken.get());
        return {
          status: 200
        } as HTTPResponse;
      }
    } catch (e) {
      consolaGlobalInstance.debug(e);
    }

    this.$auth.ctx.$toast.error('There was an issue. We will have to log you out, sorry.');
    await this.logout();
  }

  async login(request) {
    try {
      const {
        data: {
          login: { id, accessToken, refreshToken }
        }
      } = await this.$apollo.mutate({
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
        await this.setUserToken(accessToken, refreshToken);
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

  async fetchUser() {
    // Token is required but not available
    if (!this.check().valid) {
      if (this.$auth.loggedIn) {
        return this.logout();
      }
      return;
    }

    const {
      data: { users_by_pk }
    } = await this.$apollo.query({
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
    if (this.$auth.loggedIn) {
      consolaGlobalInstance.debug('Logging out user', this.$auth.user);
      const {
        data: {
          logout: { success }
        }
      } = await this.$apollo.query({
        query: logout
      });
      if (success) {
        this.$auth.ctx.$toast.success('You have been successfully logged out! See you next time.');
      } else {
        this.$auth.ctx.$toast.error('There was an issue but you will still be logged out. Bye!');
      }
      this.$auth.$storage.removeUniversal('user');
      await this.$auth.ctx.$apolloHelpers.onLogout();
      await super.logout();
      super.reset();
    }
  }
}

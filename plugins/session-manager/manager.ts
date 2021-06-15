import { ApolloHelpers } from '@nuxtjs/apollo';
import { timer, Subscription } from 'rxjs';
import { Store } from 'vuex';
import { Toasted } from 'vue-toasted/types';
import { Context } from '@nuxt/types';
import { ApolloClient } from 'apollo-client';
import refresh_token from './refresh_token.graphql';
import login from './login.graphql';

export class SessionManager {
  $apollo: ApolloClient<any>;
  $apolloHelpers: ApolloHelpers;
  $toast: Toasted;
  redirect: Context['redirect'];
  $store: Store<any>;
  refreshSub?: Subscription;
  refreshInterval = 600;
  endpoint: string = 'http://localhost:8080/v1/graphql';

  constructor(
    $apollo,
    $apolloHelpers: ApolloHelpers,
    $toast: Toasted,
    redirect: Context['redirect'],
    $store: Store<any>,
    refreshInterval: number,
    endpoint: string
  ) {
    this.$apollo = $apollo;
    this.$apolloHelpers = $apolloHelpers;
    this.$toast = $toast;
    this.redirect = redirect;
    this.$store = $store;
    this.refreshInterval = refreshInterval;
    this.endpoint = endpoint;
  }

  async login(username: string, password: string) {
    try {
      const {
        data: {
          login: { accessToken, expires }
        }
      } = await this.$apollo.mutate({
        mutation: login,
        variables: {
          data: {
            username,
            password
          }
        }
      });
      await this.$store.dispatch('user/login', { id: '0', username, roles: ['user'], expires });
      await this.$apolloHelpers.onLogin(accessToken);
      return true;
    } catch (e) {
      console.debug(e);
    }

    return false;
  }

  startSession = () => {
    const expiry = this.$store.getters['user/me'].expires;
    const lastRefreshDif = (this.$store.getters['user/me'].lastRefresh || Date.now()) - Date.now() - expiry;
    const start = lastRefreshDif < expiry && lastRefreshDif > 0 ? lastRefreshDif : expiry;
    this.refreshSub = timer(start).subscribe(async () => {
      await this.refreshSession();
      this.startSession();
    });
    return this;
  };

  stopSession() {
    this.refreshSub?.unsubscribe();
    return this;
  }

  refreshSession = async () => {
    try {
      const {
        data: {
          refreshToken: { accessToken, expires }
        }
      } = await this.$apollo.mutate({
        mutation: refresh_token
      });
      if (accessToken) {
        await this.$store.dispatch('user/refresh');
        await this.$store.dispatch('user/expiry', expires);
        return this.$apolloHelpers.onLogin(accessToken);
      }
    } catch (e) {
      console.debug(e);
    }

    this.$toast.error('There was an issue. We will have to log you out, sorry.');
    this.stopSession();
    await this.$apolloHelpers.onLogout();
    await this.redirect('/login');
  };
}

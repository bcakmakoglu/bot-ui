import { Module, VuexModule, VuexMutation, VuexAction } from 'nuxt-property-decorator';

interface User {
  id: string;
  username: string;
  roles: string[];
  lastRefresh: Date;
  expiry: Date;
}

const state = (): User => ({
  id: '0',
  username: 'John Doe',
  roles: ['user'],
  lastRefresh: undefined,
  expiry: undefined
});

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})
export default class UserStore extends VuexModule {
  _user = state();

  @VuexMutation
  setUser(data: User) {
    this._user = data;
  }

  @VuexMutation
  setLastRefresh(data: Date) {
    this._user.lastRefresh = data;
  }

  @VuexMutation
  setExpiry(data: Date) {
    this._user.expiry = data;
  }

  @VuexAction({ commit: 'setUser' })
  login(user: User) {
    return user;
  }

  @VuexAction({ commit: 'setUser' })
  logout() {
    return state();
  }

  @VuexAction({ commit: 'setLastRefresh' })
  refresh() {
    return new Date();
  }

  @VuexAction({ commit: 'setExpiry' })
  expiry(date: Date) {
    return date;
  }

  get me() {
    return this._user;
  }
}

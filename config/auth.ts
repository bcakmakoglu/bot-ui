import { Auth0ProviderOptions } from '@nuxtjs/auth-next';

const AuthConfig = {
  sk: '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',
  pk: 'NfEj+5saI7RZVPKOee7QFao9VG6c8VE+jvT4BjrKJaJI9zZk+e9vQAOtmhQFNs1crFEKqMSkpvdj2jGvqioCDin2H0LVUmFx5VLX0PUTkPc3uk/aAw0FLVPtaCh0EK4e/Imu5JJNPl2moqhNMhtyilBeS6YCHxuqzi3dt3yd3P/PqH3f8KEm70Ec6gaKoFuzVC9rltL6xbKKmg/JOpN+QwFn3na1T40xE1YwcMMolvNkQmpvNNHOzG79y+1d72PI3QYzOWRtPsmnzHbCIm9aQnIKsboLd663B4/kCtNcD+DacEUgxvpKu+hag8+RIDX0tf1clIsab0tWDiLnMToh2bdRUIP2ZEv9lq9jF97G6QnKQqS8YBOy781rCow9BRpObkoiQRSHsGI0cKYR60sHP9YENwjK0Lv7uYWXV4SLe0M5LKKmmwxa2OjMpjaxtOMb/UduZ7uA7F8T3DA2K4Fkl4eWSrExRuQGfses3WmQ5E0Piz8o+U4EtJ2NpDuneGwVXpwFd3jPVlCG3lEkbr6SZEY41FcgjjVBI/X7t/UPS7+hjUIJpqG5zgVQ3DKPLIzIXHydvPo2HaZ0pxHia7iZrzJDp/jTKJsYpMV8Hu7ZLK42ZQIZHQ8ZdhJ9AmSsPQM2v8r6OmleuwSwE5S2sq2yWupxEs3PzBgaQBhuf/cwQ55ysyRcDaxmcGXk88LAjbbXScDvtIvXIB5iSsnIB8gd/g/eOR3zpiidFqcwebsbAaQzo09CmLaX5BI8nRgj/eixVwRa5u5Z1UQCdGdRnDl5GNpRvlbK92wXYm2uJzmdWvTPY3xerjnB3zioAgo+ljF73Ily3jhxBVLkLiuGDt0WrPi/Ewk7zU6pAZRODAZEzXNchT+wVLsMsgDL9HshrZgB0yWYbE6XNAy/LjpbatrYhkNQCG89cmfVqWfJh4fyKcymNaqbDRpI/YhoQTEm+WUjcurYnVC7rcDcRaC61zwCc68qsSMg+sejPUvEBNJGPnJ4rW0nRjfCO48SG35GfkJdwTV68YJacnImAGBioEYW0KmBjWS4QNdJqzuIw/UyH9Q='
};

export default AuthConfig;

export const NuxtAuthConfig = {
  defaultStrategy: 'hasura',
  strategies: {
    hasura: {
      enabled: true,
      name: 'hasura',
      scheme: '~/auth/schemes/hasura-scheme',
      token: {
        required: true,
        property: 'access_token',
        maxAge: 1800,
        global: true,
        type: 'Bearer'
      },
      refreshToken: {
        property: 'refresh_token',
        maxAge: 60 * 60 * 24 * 30,
        type: 'Bearer',
        required: true,
        tokenRequired: true
      },
      endpoints: {
        login: { method: 'post' },
        logout: { url: '', method: 'post' },
        refresh: { method: 'post' },
        user: { method: 'post' }
      },
      autoLogout: true
    },
    auth0: {
      domain: 'braks-bot-ui.eu.auth0.com',
      clientId: process.env.AUTH0_CLIENTID
    } as Partial<Auth0ProviderOptions>
  },
  redirect: {
    login: '/login',
    logout: '/login',
    home: '/'
  },
  token: {
    global: true
  }
};

import { onError } from '@apollo/client/link/error';
import { Context } from '@nuxt/types';

export default function ({ $config, $toast, redirect, route }: Context) {
  const httpEndpoint = $config.graphQlEndpoint;

  const link = onError(({ graphQLErrors }) => {
    graphQLErrors?.forEach((err) => {
      console.debug(err);
      if (err.message === 'Authentication failed.') {
        if (route.name !== 'login') redirect('/login');
      }
      $toast.error(err.message);
    });
  });

  return {
    link,
    httpEndpoint,
    inMemoryCacheOptions: {
      addTypename: false
    }
  };
}

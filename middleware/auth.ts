import { Context, Middleware } from '@nuxt/types';

// Check if user has a JWT token present, if not redirect back to login
const AuthMiddleware: Middleware = ({ route, redirect, app: { $apolloHelpers } }: Context) => {
  const requiresAuth = !route.name?.includes('login');
  const hasToken = !!$apolloHelpers.getToken();
  if (requiresAuth) {
    if (!hasToken) {
      $apolloHelpers.onLogout();
      redirect('/login');
    }
  } else if (!requiresAuth) {
    if (hasToken) {
      redirect('/');
    }
  }
};

export default AuthMiddleware;

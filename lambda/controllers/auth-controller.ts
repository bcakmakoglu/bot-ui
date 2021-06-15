import {
  apiController,
  body,
  POST,
  Controller,
  apiOperation,
  apiRequest,
  apiResponse,
  api,
  controllerProduces
} from 'ts-lambda-api';
import { injectable, inject } from 'inversify';
import parse from 'destr';
import { gql } from 'graphql-tag';
import { execute, makePromise } from 'apollo-link';
import { AccessDeniedError } from '@/error';
import link from '~/utils/httplink';
import { Jwt } from '~/utils/jwt';

@apiController('/auth')
@controllerProduces('application/json')
@api('Auth Api', 'Log user in, refresh JWT tokens etc.')
@injectable()
export class AuthController extends Controller {
  @inject(Jwt) jwt: Jwt;
  options = {
    context: {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || ''
      }
    }
  };

  @POST('/login')
  @apiOperation({ name: 'login user', description: 'Checks user credentials and returns a JWT token.' })
  @apiRequest({
    class: () => {},
    description: 'user credentials'
  })
  @apiResponse(200, {
    class: () => ({ accessToken: 'JWT Token', expires: 600 }),
    description: 'JWT Token for successful login.'
  })
  @apiResponse(403, {
    class: AccessDeniedError,
    description: 'Authentication failed.'
  })
  async login(@body payload: any) {
    const {
      input: { data }
    } = parse(payload);
    const options = {
      query: gql`
        query ($username: String!, $password: String!) {
          users(where: { username: { _eq: $username } }) {
            id
            username
            pwd_match(args: { pwd: $password })
          }
        }
      `,
      variables: {
        username: data.username,
        password: data.password
      },
      ...this.options
    };

    try {
      const result = await makePromise(execute(link, options));
      if (result.data?.users.length) {
        const user = result.data.users[0];
        if (user.pwd_match) {
          const { accessToken, expires } = this.jwt.sign(user);
          // For safety we'll try to verify the JWT after signing
          this.jwt.verify(accessToken, this.jwt.public);
          await this._updateLastSeen(user.id);
          console.log(`Authentication successful! Logged in as ${user.username}`);
          return this.response.status(200).send({ accessToken, expires });
        }
      }
    } catch (e) {
      console.log(`Authentication error: ${e.message}`);
    }
    throw new AccessDeniedError('Authentication failed.');
  }

  @POST('/refresh-token')
  @apiRequest({
    class: () => {},
    description: 'Refresh token of user'
  })
  @apiResponse(200, {
    class: () => ({ accessToken: 'JWT Token', expires: 600 }),
    description: 'JWT Token for successful refresh.'
  })
  @apiResponse(403, {
    class: AccessDeniedError,
    description: 'Could not refresh JWT.'
  })
  async refresh(@body payload: any) {
    const token = this.request.headers.authorization?.split(' ');
    const id = payload.session_variables['x-hasura-user-id'];
    if (!token || !id) throw new AccessDeniedError('No JWT token found or invalid user-id provided.');

    const options = {
      query: gql`
        query ($id: uuid!) {
          users_by_pk(id: $id) {
            id
            username
            last_seen
          }
        }
      `,
      variables: {
        id
      },
      ...this.options
    };
    try {
      const result = await makePromise(execute(link, options));

      if (result.data?.users_by_pk) {
        const user = result.data.users_by_pk;
        // If last JWT refresh was an hour ago we will have to decline refresh and log the user out
        const expirationTimeframe = 60 * 60 * 1000;
        if (Date.now() - Date.parse(user.last_seen) <= expirationTimeframe) {
          this.jwt.verify(token[1], this.jwt.public);
          const { accessToken, expires } = this.jwt.sign(user);
          await this._updateLastSeen(id);
          return this.response.status(200).send({ accessToken, expires });
        }
      }
    } catch (e) {
      console.log(e);
    }
    throw new AccessDeniedError('Could not refresh JWT.');
  }

  private async _updateLastSeen(id: string) {
    const options = {
      query: gql`
        mutation ($id: uuid!, $timestamp: timestamptz!) {
          update_users_by_pk(_set: { last_seen: $timestamp }, pk_columns: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id,
        timestamp: new Date().toISOString()
      },
      ...this.options
    };
    try {
      return await makePromise(execute(link, options));
    } catch (e) {
      console.log('Refreshing last_seen value failed', e);
    }
    throw new AccessDeniedError('Could not update last_seen value.');
  }
}

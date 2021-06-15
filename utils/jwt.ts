import { createDecipheriv, Decipher } from 'crypto';
import { sign, verify, Algorithm } from 'jsonwebtoken';
import { injectable } from 'inversify';
import AuthConfig from '../config/auth';

@injectable()
export class Jwt {
  secret = '';
  public = '';
  options = {
    algorithm: 'RS256' as Algorithm,
    expiresIn: Number(process.env.REFRESH_INTERVAL || 600) * 1000,
    issuer: 'braks'
  };

  constructor() {
    if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) throw new Error('Encryption key/iv not set.');

    const algorithm = 'aes-128-cbc';
    const cipher1 = createDecipheriv(algorithm, process.env.ENCRYPTION_KEY || '', process.env.ENCRYPTION_IV || '');
    const cipher2 = createDecipheriv(algorithm, process.env.ENCRYPTION_KEY || '', process.env.ENCRYPTION_IV || '');

    const { pk, sk } = AuthConfig;
    this.secret = Jwt._decipherKey(cipher1, sk);
    this.public = Jwt._decipherKey(cipher2, pk);
  }

  private static _decipherKey(cipher: Decipher, key: string) {
    let decrypted = cipher.update(key, 'base64', 'utf8');
    decrypted += cipher.final('utf8');
    return decrypted;
  }

  sign(user: Record<string, string>, options?: Partial<Jwt['options']>) {
    const claims = {
      sub: user.id,
      name: user.username,
      admin: false,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': user.id
      }
    };

    return { token: sign(claims, this.secret, Object.assign(this.options, options)) };
  }

  verify = verify;
}

export const JsonWebToken = new Jwt();

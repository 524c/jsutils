/* eslint-disable @typescript-eslint/return-await */
/**
 *
 *
 * This module contains functions and types
 * to encode and decode {@link https://authjs.dev/concepts/session-strategies#jwt-session JWT}s
 * issued and used by Auth.js.
 *
 * The JWT issued by Auth.js is _encrypted by default_, using the _A256CBC-HS512_ algorithm ({@link https://www.rfc-editor.org/rfc/rfc7518.html#section-5.2.5 JWE}).
 * It uses the `AUTH_SECRET` environment variable or the passed `secret` propery to derive a suitable encryption key.
 *
 * :::info Note
 * Auth.js JWTs are meant to be used by the same app that issued them.
 * If you need JWT authentication for your third-party API, you should rely on your Identity Provider instead.
 * :::
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * You can then import this submodule from `@auth/core/jwt`.
 *
 * ## Usage
 *
 * :::warning Warning
 * This module *will* be refactored/changed. We do not recommend relying on it right now.
 * :::
 *
 *
 * ## Resources
 *
 * - [What is a JWT session strategy](https://authjs.dev/concepts/session-strategies#jwt-session)
 * - [RFC7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519)
 *
 * @module jwt
 */

import { hkdf } from '@panva/hkdf';
import {
  EncryptJWT,
  base64url,
  calculateJwkThumbprint,
  jwtDecrypt
} from 'jose';

export type Awaitable<T> = T | PromiseLike<T>;
export type Awaited<T> = T extends Promise<infer U> ? U : T;

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const now = () => (Date.now() / 1000) | 0;

const alg = 'dir';
const enc = 'A256CBC-HS512';
type Digest = Parameters<typeof calculateJwkThumbprint>[1];

async function getDerivedEncryptionKey(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  enc: string,
  keyMaterial: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  let length: number;
  switch (enc) {
    case 'A256CBC-HS512':
      length = 64;
      break;
    case 'A256GCM':
      length = 32;
      break;
    default:
      throw new Error('Unsupported JWT Content Encryption Algorithm');
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await hkdf(
    'sha256',
    keyMaterial,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );
}

/** Issues a JWT. By default, the JWT is encrypted using "A256CBC-HS512". */
export async function encode<Payload = JWT>(params: JWTEncodeParams<Payload>) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt } = params;
  const secrets = Array.isArray(secret) ? secret : [secret];
  const encryptionSecret = await getDerivedEncryptionKey(enc, secrets[0], salt);

  const thumbprint = await calculateJwkThumbprint(
    { kty: 'oct', k: base64url.encode(encryptionSecret) },
    `sha${encryptionSecret.byteLength << 3}` as Digest
  );

  // eslint-disable @typescript-eslint/return-await
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await new EncryptJWT(token as JWT)
    .setProtectedHeader({ alg, enc, kid: thumbprint })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionSecret);
}

/** Decodes a Auth.js issued JWT. */
export async function decode<Payload = JWT>(
  params: JWTDecodeParams
): Promise<Payload | null> {
  const { token, secret, salt } = params;
  const secrets = Array.isArray(secret) ? secret : [secret];
  if (!token) return null;
  const { payload } = await jwtDecrypt(
    token,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async ({ kid, enc }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      for (const secret of secrets) {
        const encryptionSecret = await getDerivedEncryptionKey(
          enc,
          secret,
          salt
        );
        if (kid === undefined) return encryptionSecret;

        const thumbprint = await calculateJwkThumbprint(
          { kty: 'oct', k: base64url.encode(encryptionSecret) },
          `sha${encryptionSecret.byteLength << 3}` as Digest
        );
        if (kid === thumbprint) return encryptionSecret;
      }

      throw new Error('no matching decryption secret');
    },
    {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, 'A256GCM']
    }
  );
  return payload as Payload;
}

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Returned by the `jwt` callback when using JWT sessions
 *
 * [`jwt` callback](https://authjs.dev/reference/core/types#jwt)
 */
export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge?: number;
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /** Used in combination with `salt`, to derive the encryption secret for JWTs. */
  secret: string | string[];
  /** The JWT payload. */
  token?: Payload;
}

export interface JWTDecodeParams {
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /**
   * Used in combination with `salt`, to derive the encryption secret for JWTs.
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   */
  secret: string | string[];
  /** The Auth.js issued JWT to be decoded */
  token?: string;
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the Auth.js issued JWT.
   * It can be an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * @internal
   */
  secret: string | string[];
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge: number;
  /** Override this method to control the Auth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>;
  /** Override this method to control the Auth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>;
}

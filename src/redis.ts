import ioRedis from 'ioredis';

/**
 * A Redis client that supports JSON.
 */
export class Redis extends ioRedis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private redis: ioRedis;

  /**
   * Create a new Redis instance.
   * @param url The Redis URL.
   */
  constructor(url: string | undefined) {
    super(url);
    this.redis = new ioRedis(url);
  }

  /**
   * Get a key's value.
   * @param key The key that holds the value.
   * @returns The value, or null when the key is missing.
   * @example
   * ```typescript
   * const value = await redis.get('key');
   * ```
   */
  public async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Set a key's value.
   * @param key The key that will hold the value.
   * @param value The value to set.
   * @example
   * ```typescript
   * await redis.set('key', 'value');
   * ```
   */
  public async setJSON<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  /**
   * Set a key's time to live in seconds.
   * @param key The key that will disappear after the timeout.
   * @param seconds The number of seconds.
   * @param value The value to set.
   * @example
   * ```typescript
   * await redis.setex('key', 60, 'value');
   * ```
   */
  public async setJSONex<T>(
    key: string,
    seconds: number,
    value: T
  ): Promise<void> {
    await this.redis.setex(key, seconds, JSON.stringify(value));
  }

  /**
   * Get a key, field value.
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is missing.
   * @example
   * ```typescript
   * const value = await redis.hget('key', 'field');
   * ```
   */
  public async hgetJSON<T>(key: string, field: string): Promise<T | null> {
    const value = await this.redis.hget(key, field);
    if (!value) return null;
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Get a key, field value.
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is missing.
   * @example
   * ```typescript
   * const value = await redis.hget('key', 'field');
   * ```
   */
  public async hsetJSON<T>(
    key: string,
    field: string,
    value: T
  ): Promise<void> {
    await this.redis.hset(key, field, JSON.stringify(value));
  }

  /**
   *
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is missing.
   * @example
   * ```typescript
   * const value = await redis.hget('key', 'field');
   * ```
   */
  public async hgetAll(key: string): Promise<{ [key: string]: any } | null> {
    const values: { [key: string]: any } = {};

    return this.redis.hgetall(key, (err, reply) => {
      if (err) {
        return null;
      } else {
        for (const field in reply) {
          if (reply.hasOwnProperty(field)) {
            values[field] = reply[field];
          }
        }
        return values;
      }
    });
  }

  /**
   *
   * @param key holds the key value
   * @returns The parsed value of a json, or null when the key is missing.
   * @example
   * ```typescript
   * await Redis.hgetAllJSON('key').then(
   * 	(res: { [key: string]: any } | null) => {
   * 		console.log("res =>", res);
   * 	},
   * ).catch((err: any) => {
   * 	console.log("err =>", err);
   * });
   * ```
   */
  public async hgetAllJSON(
    key: string
  ): Promise<{ [key: string]: any } | null> {
    const values: { [key: string]: any } = {};

    return this.redis.hgetall(key, (err, reply) => {
      if (err) {
        return null;
      } else {
        for (const field in reply) {
          if (reply.hasOwnProperty(field)) {
            values[field] = JSON.parse(reply[field]);
          }
        }
        return values;
      }
    });
  }
}

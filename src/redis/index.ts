import * as ioRedis from 'ioredis';

/**
 * A Redis client that supports JSON.
 */
class Redis extends ioRedis.Redis {
  /**
   * Create a new Redis instance.
   * @param options The options for the Redis client or a Redis URL.
   * @example
   * ```typescript
   * import Redis from '@524c/jsutils';
   * const redis = new Redis('redis://localhost:6379');
   * ```
   */
  constructor(options?: string | ioRedis.RedisOptions) {
    if (typeof options === 'string') {
      const url = options;
      const parsedUrl = new URL(url);
      const urlOptions: ioRedis.RedisOptions = {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port || '6379')
      };
      super(urlOptions);
    } else {
      super(options || {});
    }
  }

  /**
   * Get a parsed JSON value from a key.
   * @param key The key that holds the value.
   * @returns The value, or null when the key is missing.
   * @example
   * ```typescript
   * const value = await redis.getJSON('key');
   * ```
   * @example
   * ```typescript
   * const value = await redis.getJSON('key');
   * ```
   */
  public async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Save a JSON representation of a value to a key.
   * @param key The key that will hold the value.
   * @param value The value to set.
   * @example
   * ```typescript
   * await redis.setJSON('key', 'value')
   * ```
   */
  public async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  /**
   * Save JSON representation of objects with an expiration time.
   * @param key The key that will disappear after the timeout.
   * @param seconds The number of seconds.
   * @param value The value to set.
   * @example
   * ```typescript
   * await redis.setJSONex('key', 60, 'value');
   * ```
   */
  public async setJSONex<T>(
    key: string,
    seconds: number,
    value: T
  ): Promise<void> {
    await this.setex(key, seconds, JSON.stringify(value));
  }

  /**
   * Get the parsed JSON value of a hash field.
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is not found.
   * @example
   * ```typescript
   * const value = await redis.hgetJSON('key', 'field');
   * ```
   */
  public async hgetJSON<T>(key: string, field: string): Promise<T | null> {
    const value = await this.hget(key, field);
    if (!value) return null;
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Save JSON representation of objects.
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is not found.
   * @example
   * ```typescript
   * const value = await redis.hsetJSON('key', 'field', 'value');
   * ```
   */
  public async hsetJSON<T>(
    key: string,
    field: string,
    value: T
  ): Promise<void> {
    await this.hset(key, field, JSON.stringify(value));
  }

  /**
   * Get the parsed JSON value of a hash field.
   * @param key holds the key value
   * @param field holds the key value
   * @returns The parsed value of a json, or null when the key is not found.
   * @example
   * ```typescript
   * const value = await redis.hgetAll('key');
   * ```
   */
  public async hgetAllJSON(
    key: string
  ): Promise<{ [key: string]: any } | null> {
    const values: { [key: string]: any } = {};

    try {
      const reply = await this.hgetall(key);

      if (!reply || Object.keys(reply).length === 0) {
        return null;
      }

      for (const field in reply) {
        if (reply.hasOwnProperty(field)) {
          values[field] = JSON.parse(reply[field]);
        }
      }
    } catch (err) {
      return null;
    }

    return values;
  }

  /**
   * Get all the fields and values in a hash
   * @param key holds the key value
   * @example
   * ```typescript
   * const value = await redis.hgetAll('key');
   * ```
   */
  public async hgetAll(key: string): Promise<{ [key: string]: any } | null> {
    return this.hgetall(key);
  }
}

export default Redis;

import Redis from '.';

const redis = new Redis('redis://localhost:6379');

describe('Redis', () => {
  it('should pass', async () => {
    expect(redis).toBeDefined();
    const ping = await redis.ping();
    expect(ping).toBe('PONG');
    const key = crypto.randomUUID();
    const value = crypto.randomUUID();
    await redis.set(key, value);
    const result = await redis.get(key);
    expect(result).toBe(value);
    await redis.del(key);
    const deleted = await redis.get(key);
    expect(deleted).toBeNull();
  });

  it('getJSON', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.setJSON(key, value);
    const result = await redis.getJSON(key);
    expect(result).toEqual(value);
    await redis.del(key);
    const deleted = await redis.getJSON(key);
    expect(deleted).toBeNull();
  });

  it('setJSON', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.setJSON(key, value);
    const result = await redis.getJSON(key);
    expect(result).toEqual(value);
    await redis.del(key);
    const deleted = await redis.getJSON(key);
    expect(deleted).toBeNull();
  });

  it('setJSONex', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.setJSONex(key, 60, value);
    const result = await redis.getJSON(key);
    expect(result).toEqual(value);
    await redis.del(key);
    const deleted = await redis.getJSON(key);
    expect(deleted).toBeNull();
  });

  it('hgetJSON', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.hsetJSON(key, 'a', value);
    const result = await redis.hgetJSON(key, 'a');
    expect(result).toEqual(value);
    await redis.del(key);
    const deleted = await redis.hgetJSON(key, 'a');
    expect(deleted).toBeNull();
  });

  it('hsetJSON', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.hsetJSON(key, 'a', value);
    const result = await redis.hgetJSON(key, 'a');
    expect(result).toEqual(value);
    await redis.del(key);
    const deleted = await redis.hgetJSON(key, 'a');
    expect(deleted).toBeNull();
  });

  it('hgetAllJSON', async () => {
    const key = crypto.randomUUID();
    const value = { a: 1, b: '2', c: true };
    await redis.hsetJSON(key, 'a', value);
    const result = await redis.hgetAllJSON(key);
    expect(result).toEqual({ a: value });
    await redis.del(key);
    const deleted = await redis.hgetAllJSON(key);
    expect(deleted).toBeNull();
  });
});

import { Redis } from './redis';
import { mocked } from 'jest-mock';

jest.mock('ioredis');

describe('Redis', () => {
  let redis: Redis;

  beforeEach(() => {
    redis = new Redis('redis://localhost:6379');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return the value for the given key', async () => {
      const expected = 'bar';
      mocked(redis.get).mockResolvedValue(expected);
      const result = await redis.get('foo');
      expect(result).toEqual(expected);
    });

    it('should return null if the key does not exist', async () => {
      mocked(redis.get).mockResolvedValue(null);
      const result = await redis.get('foo');
      expect(result).toBeNull();
    });
  });
});

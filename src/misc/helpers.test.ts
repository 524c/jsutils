import { deepCopy } from './helpers';
import { sleep } from './helpers';
import { timeoutFnRun } from './helpers';
import { raceFnRun } from './helpers';
import { isNumber } from './helpers';

describe('deepCopy', () => {
  it('should return null if the input is null', () => {
    const input = null;
    const result = deepCopy(input);
    expect(result).toBeNull();
  });

  it('should return the same value if the input is not an object', () => {
    const input = 123;
    const result = deepCopy(input);
    expect(result).toBe(input);
  });

  it('should return a deep copy of an array', () => {
    const input = [1, 2, 3];
    const result = deepCopy(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('should return a deep copy of a date object', () => {
    const input = new Date();
    const result = deepCopy(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('should return a deep copy of a regular expression object', () => {
    const input = /test/;
    const result = deepCopy(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('should return a deep copy of an object', () => {
    const input = { foo: 'bar', baz: { nested: true } };
    const result = deepCopy(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
    expect(result.baz).toEqual(input.baz);
    expect(result.baz).not.toBe(input.baz);
  });
});

describe('sleep', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});

describe('isNumber', () => {
  it('should return true if the input is a number', () => {
    const input = 123;
    const result = isNumber(input);
    expect(result).toBe(true);
  });

  it('should return false if the input is not a number', () => {
    const input = '123';
    const result = isNumber(input);
    expect(result).toBe(false);
  });
});

describe('timeoutFnRun', () => {
  it('should execute the provided function within the specified time limit', async () => {
    const callback = async (a: number, b: number): Promise<number> => {
      // Simulate some asynchronous computation
      await new Promise((resolve) => setTimeout(resolve, 200));
      return a + b;
    };

    const result = await timeoutFnRun([callback, [3, 5]], 1000);
    expect(result).toEqual([true, 8]);
  });

  it('should handle function execution exceeding the time limit', async () => {
    const callback = async (): Promise<number> => {
      // Simulate some long-running asynchronous computation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 42;
    };

    const result = await timeoutFnRun([callback, []], 500);
    expect(result).toEqual([false, false]);
  });

  it('should handle errors thrown by the provided function', async () => {
    const callback = async (): Promise<number> => {
      throw new Error('Test error');
    };

    const result = await timeoutFnRun([callback, []], 500);
    expect(result[0]).toBe(false);
    expect(result[1]).toBeInstanceOf(Error);
    expect((result[1] as Error).message).toBe('Test error');
  });
});

describe('raceFnRun', () => {
  it('should run the function and return the result', async () => {
    const result = await raceFnRun(
      [
        (delay) => {
          return new Promise((resolve) =>
            setTimeout(() => resolve(123), delay)
          );
        },
        [500]
      ],
      [
        (delay) => {
          return new Promise((resolve) =>
            setTimeout(() => resolve(456), delay)
          );
        },
        [1000]
      ]
    );
    expect(result).toBe(123);
  });
});

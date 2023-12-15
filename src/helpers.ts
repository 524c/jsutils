export type CallbackFunction = [(...args: any[]) => any, ...any[]];
export type FnResult = [boolean, unknown];

/**
 *
 * @param name
 * @param value
 * @param days
 * @example
 * setCookie('name', 'value', 7);
 */
export function setCookie(name: string, value: string, days: number = 0) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

/**
 *
 * @param obj
 * @returns obj deep copy
 * @example
 * const obj = deepCopy({ a: 1, b: 2, c: 3 });
 */
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepCopy(obj[i]);
    }
    return arrCopy as T;
  }

  if (obj instanceof Date) {
    return new Date(obj) as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as T;
  }

  const objCopy: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepCopy(obj[key]);
    }
  }

  return objCopy as T;
}

/**
 * Async sleep helper
 * @param ms wait time in milliseconds
 * @returns void
 * @example
 * await sleep(1000);
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Async timeout function run helper
 * @param Fn generic function [callback, params]
 * @param time timeout in milliseconds
 * @returns [status with Promise run return, callback function return]
 * @example
 * const [status, result] = await timeoutFnRun([callback, params], 1000);
 */
export const timeoutFnRun = async (
  Fn: CallbackFunction,
  time: number
): Promise<FnResult> => {
  const [fn, params] = Fn;
  let rOk = true;

  const p1 = new Promise((res) => {
    res(fn.apply(this, params));
  });

  const p2 = new Promise((res) => {
    setTimeout(() => {
      rOk = false;
      res(rOk);
    }, time);
  });

  try {
    const result = await Promise.race([p1, p2]);
    return [rOk, result];
  } catch (error) {
    return [false, error];
  }
};

/**
 * Async parallel function run helper
 * @param Fn1 generic function [callback, params]
 * @param Fn2 generic function [callback, params]
 * @returns callback function return
 * @example
 * const result = await parallelFnRun([callback, params], [callback, params]);
 */
export const raceFnRun = async (
  Fn1: CallbackFunction,
  Fn2: CallbackFunction
) => {
  const [fn1, params1] = Fn1;
  const [fn2, params2] = Fn2;

  const p1 = new Promise((res) => {
    res(fn1.apply(this, params1));
  });

  const p2 = new Promise((res) => {
    res(fn2.apply(this, params2));
  });

  return Promise.race([p1, p2]).then((value) => {
    return value;
  });
};

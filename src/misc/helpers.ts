export type CallbackFunction = [(...args: any[]) => Promise<any>, any[]];
export type FnResult = [boolean, unknown];

/**
 * Deep copy an object
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
 * Validate if a value is a valid number
 * @param value string or number
 * @returns boolean
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
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
 * Async race function run helper
 * @param Fn1 - Array containing the callback function and its parameters
 * @param Fn2 - Array containing the callback function and its parameters
 * @returns The value returned by the first function that is completed
 * @example
 * const result = await raceFnRun([callback, params], [callback, params]);
 */
export const raceFnRun = async (
  Fn1: CallbackFunction,
  Fn2: CallbackFunction
): Promise<any> => {
  const [fn1, params1] = Fn1;
  const [fn2, params2] = Fn2;

  const p1 = fn1(...params1);
  const p2 = fn2(...params2);

  return Promise.race([p1, p2]);
};

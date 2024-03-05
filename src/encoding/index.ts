import Bourne from '@hapi/bourne';

declare global {
  interface String {
    format(...args: any[]): string;
  }
}

/**
 *
 * @param value base64 string
 * @returns parsed object
 * @example
 * fromBase64('eyJmb28iOiJiYXIifQ==');
 */
async function fromBase64<T>(value: string): Promise<Awaited<T>> {
  try {
    return Bourne.parse(Buffer.from(value, 'base64').toString('utf8')) as T &
      Awaited<T>;
  } catch (err) {
    throw new Error(`Could not parse base64 value: ${value}`);
  }
}

/**
 *
 * @param data to encode
 * @returns base64 string
 * @example
 * toBase64({ foo: 'bar' });
 */
async function toBase64<T>(data: T): Promise<string> {
  try {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  } catch (err) {
    throw new Error('Could not stringify data');
  }
}

/**
 * Enable string format function
 * @example
 * 'Hello {0}'.format('World');
 */
function enableStringFormat() {
  String.prototype.format = function (...args: any[]): string {
    let formatted: string = this.toString(); // Convert 'this' to a string
    for (let i = 0; i < args.length; i++) {
      const regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[i]);
    }
    return formatted;
  };
}

export default {
  fromBase64,
  toBase64,
  enableStringFormat
};

export { fromBase64, toBase64, enableStringFormat };

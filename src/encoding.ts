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
export async function fromBase64<T>(value: string): Promise<Awaited<T>> {
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
export async function toBase64<T>(data: T): Promise<string> {
  try {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  } catch (err) {
    throw new Error('Could not stringify data');
  }
}

/**
 *
 * @param input string to sanitize
 * @returns sanitized string
 * @example
 * sanitizeHtml('<script>alert("hi")</script>')
 */
export function sanitizeHtml(input: string) {
  let sanitized = input.replace(/<[^>]*>/g, '');

  sanitized = sanitized.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  const trimmedString: string = sanitized.trim();

  return trimmedString;
}

/**
 * Enable string format function
 * @example
 * 'Hello {0}'.format('World');
 */
export function enableStringFormat() {
  String.prototype.format = function (...args: any[]): string {
    let formatted: string = this.toString(); // Convert 'this' to a string
    for (let i = 0; i < args.length; i++) {
      const regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[i]);
    }
    return formatted;
  };
}

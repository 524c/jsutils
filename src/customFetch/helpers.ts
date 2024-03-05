/**
 * Sets a cookie in the browser with the specified name, value, and optional expiration period.
 * @param name - The name of the cookie.
 * @param value - The value to be stored in the cookie.
 * @param [days=0] - Number of days until the cookie expires. If not provided or set to 0, the cookie will be treated as a session cookie.
 * @returns {void}
 * @example
 * setCookie('name', 'value', 7);
 */
export function setCookie(name: string, value: string, days: number = 0): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

/**
 * Sanitizes an HTML input string by removing all HTML tags and script elements.
 * @param input - The HTML input string to be sanitized.
 * @returns A sanitized string with all HTML tags and script elements removed.
 * @example
 * const data = sanitizeHtml('<p>hello</p><script>alert("world")</script>');
 * console.log(data); // Output: hello
 */
export function sanitizeHtml(input: string) {
  let sanitized = input.replace(/<[^>]*>/g, '');

  sanitized = sanitized.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  const trimmedString: string = sanitized.trim();

  return trimmedString;
}

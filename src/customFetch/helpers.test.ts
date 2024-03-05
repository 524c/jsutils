import { sanitizeHtml } from './helpers';

describe('sanitizeHtml', () => {
  it('should remove all html tags', () => {
    const input = '<script>alert("hi")</script>';
    const result = sanitizeHtml(input);
    expect(result).toBe('alert("hi")');
  });
});

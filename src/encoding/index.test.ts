import { fromBase64, toBase64, enableStringFormat } from '.';

describe('encoding', () => {
  describe('fromBase64', () => {
    it('should parse a base64 string into an object', async () => {
      const input = 'eyJmb28iOiJiYXIifQ=='; // {"foo":"bar"}
      const expected = { foo: 'bar' };
      const result = await fromBase64<typeof expected>(input);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the input is not valid base64', async () => {
      const input = 'not-base64';
      await expect(fromBase64(input)).rejects.toThrow(
        'Could not parse base64 value: not-base64'
      );
    });
  });

  describe('toBase64', () => {
    it('should encode an object into a base64 string', async () => {
      const input = { foo: 'bar' };
      const expected = 'eyJmb28iOiJiYXIifQ=='; // {"foo":"bar"}
      const result = await toBase64(input);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the input cannot be stringified', async () => {
      await expect(toBase64(undefined)).rejects.toThrow(
        // undefined cannot be stringified
        'Could not stringify data'
      );
    });
  });

  describe('enableStringFormat', () => {
    it('should enable string format function', () => {
      enableStringFormat();
      expect('Hello {0}{1}'.format('World', '!')).toEqual('Hello World!');
    });
  });
});

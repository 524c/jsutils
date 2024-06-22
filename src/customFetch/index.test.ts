/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { Fetch, CustomFetchError } from '.';
import fetch from '.';

describe('CustomFetch', () => {
  let customFetch: Fetch;

  beforeEach(() => {
    customFetch = new Fetch('https://httpbin.org/');
  });

  describe('setAuthzType', () => {
    it('test a predefined instance', async () => {
      const response = await fetch.get('https://httpbin.org/get');
      expect(response).toBeInstanceOf(Object);

      expect({
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type')
        },
        data: {
          url: response?.data?.url
        }
      }).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          url: 'https://httpbin.org/get'
        }
      });
    });

    it('should set the authorization type to basic and update the headers', () => {
      const options = {
        user: 'username',
        password: 'password',
        headers: {
          'X-Custom-Header': 'value'
        }
      };

      customFetch.setAuthzType('basic', options);

      expect(customFetch['authzType']).toEqual('basic');
      expect(customFetch['authzOptions'].headers).toEqual({
        Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
        'X-Custom-Header': 'value'
      });
    });

    it('should set the authorization type to bearer and update the headers', () => {
      const options = {
        token: 'token',
        headers: {
          'X-Custom-Header': 'value'
        }
      };

      customFetch.setAuthzType('bearer', options);

      expect(customFetch['authzType']).toEqual('bearer');
      expect(customFetch['authzOptions'].headers).toEqual({
        Authorization: 'Bearer token',
        'X-Custom-Header': 'value'
      });
    });
  });

  describe('request', () => {
    it('should make a GET request with the correct URL and headers', async () => {
      const url = '/get';
      const headers = {
        'X-Custom-Header': 'value'
      };

      const response = await customFetch.request(url, 'GET', headers);
      expect(response).toBeInstanceOf(Object);

      expect({
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type')
        },
        data: {
          url: response?.data?.url
        }
      }).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          url: 'https://httpbin.org/get'
        }
      });
    });

    it('should make a POST request with the correct URL, headers, and data', async () => {
      const url = '/post';
      const headers = {
        'X-Custom-Header': 'value'
      };
      const data = {
        key: 'value'
      };

      const response = await customFetch.request(url, 'POST', headers, data);
      expect(response).toBeInstanceOf(Object);

      expect({
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type')
        },
        data: response?.data?.json
      }).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          key: 'value'
        }
      });
    });

    it('should make a PUT request with the correct URL, headers, and data', async () => {
      const url = '/put';
      const headers = {
        'X-Custom-Header': 'value'
      };
      const data = {
        key: 'value'
      };

      const response = await customFetch.request(url, 'PUT', headers, data);
      expect(response).toBeInstanceOf(Object);

      expect({
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type')
        },
        data: response?.data?.json
      }).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          key: 'value'
        }
      });
    });

    it('should make a PATCH request with the correct URL, headers, and data', async () => {
      const url = '/patch';
      const headers = {
        'X-Custom-Header': 'value'
      };
      const data = {
        key: 'value'
      };

      const response = await customFetch.request(url, 'PATCH', headers, data);
      expect(response).toBeInstanceOf(Object);

      expect({
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type')
        },
        data: response?.data?.json
      }).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          key: 'value'
        }
      });
    });

    it('should throw an error 404 if the request fails', async () => {
      const url = '/status/404';
      const headers = {
        'X-Custom-Header': 'value'
      };

      try {
        await customFetch.request(url, 'GET', headers);
      } catch (error) {
        expect(error).toEqual(new CustomFetchError('NOT FOUND'));
      }
    });

    it('should throw an error 500 if the request fails', async () => {
      const url = '/status/500';
      const headers = {
        'X-Custom-Header': 'value'
      };

      try {
        await customFetch.request(url, 'GET', headers);
      } catch (error) {
        expect(error).toEqual(new CustomFetchError('INTERNAL SERVER ERROR'));
      }
    });
  });
});

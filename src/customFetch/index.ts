/* eslint-disable @typescript-eslint/naming-convention */
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData | URLSearchParams | null;
}

class CustomError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface Response {
  status: number;
  statusText: string;
  headers: Headers;
  data: any;
}

class CustomFetch {
  private static instance: CustomFetch;

  private authzType: string = 'basic';

  private authzOptions: Record<string, any> = {};

  private baseUrl: string | undefined;

  public constructor(baseUrl?: string) {
    this.setAuthzType = this.setAuthzType.bind(this);
    this.baseUrl = baseUrl;
  }

  static getInstance(): CustomFetch {
    if (!CustomFetch.instance) {
      CustomFetch.instance = new CustomFetch();
    }
    return CustomFetch.instance;
  }

  setAuthzType(type: string, options: Record<string, any> = {}) {
    this.authzType = type.toLocaleLowerCase();

    if (this.authzType === 'basic') {
      this.authzOptions.headers = {
        Authorization: `Basic ${Buffer.from(
          `${options.user}:${options.password}`
        ).toString('base64')}`,
        ...options.headers
      };
    } else if (this.authzType === 'bearer') {
      this.authzOptions.headers = {
        Authorization: `Bearer ${options.token}`,
        ...options.headers
      };
    }
  }

  async request(
    url: string | Request,
    method = 'GET',
    headers: Record<string, string> = {},
    data:
      | Record<string, any>
      | string
      | FormData
      | URLSearchParams
      | null = null
  ): Promise<Response> {
    const formattedBaseURL = this.baseUrl?.replace(/\/$/, '');
    const requestOptions: RequestOptions = {
      method,
      headers: {
        ...this.authzOptions.headers,
        ...headers
      },
      body: null
    };

    // set content type to application/json if not set
    if (!requestOptions.headers?.['content-type']) {
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['content-type'] = 'application/json';
    }

    if (
      ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method) &&
      data != null
    ) {
      if (typeof data === 'object') {
        requestOptions.body = JSON.stringify(data);
      } else {
        requestOptions.body = data;
      }
    }

    let finalUrl: string;
    if (url instanceof Request) {
      finalUrl = url.url;
      requestOptions.method = url.method || 'GET';
      url.headers?.forEach((value, key) => {
        requestOptions.headers = requestOptions.headers || {};
        requestOptions.headers[key] = value;
      });
    } else {
      finalUrl = url;
    }

    try {
      if (finalUrl.startsWith('/')) {
        finalUrl = finalUrl.substring(1);
      }
      const absoluteURL =
        finalUrl.startsWith('http:') || finalUrl.startsWith('https:')
          ? finalUrl
          : `${formattedBaseURL}/${finalUrl}`;

      //console.log(absoluteURL, requestOptions);
      const response = await fetch(absoluteURL, requestOptions);

      // NOTE: some web servers return json with content-type: text/plain, so we need to handle that.
      const _data = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(_data);
      } catch (error) {
        parsedData = _data;
      }

      if (!response.ok) {
        let message: string | undefined;
        if (parsedData && typeof parsedData === 'string' && parsedData !== '') {
          message = `${response.statusText} ${parsedData}`;
        } else if (parsedData && typeof parsedData === 'object') {
          message = `${response.statusText} ${JSON.stringify(parsedData)}`;
        }
        throw new CustomError(message || response.statusText, response.status);
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: parsedData
      };
    } catch (error) {
      throw error;
    }
  }

  async get(url: string | Request, headers: Record<string, string> = {}) {
    return this.request(url, 'GET', headers);
  }

  async post(
    url: string,
    data: Record<string, any> | string,
    headers: Record<string, string> = {}
  ) {
    return this.request(url, 'POST', headers, data);
  }

  async put(
    url: string,
    data: Record<string, any> | string,
    headers: Record<string, string> = {}
  ) {
    return this.request(url, 'PUT', headers, data);
  }

  async head(url: string | Request, headers: Record<string, string> = {}) {
    return this.request(url, 'HEAD', headers);
  }

  async delete(url: string | Request, headers: Record<string, string> = {}) {
    return this.request(url, 'DELETE', headers);
  }

  async options(url: string | Request, headers: Record<string, string> = {}) {
    return this.request(url, 'OPTIONS', headers);
  }

  async patch(
    url: string,
    data: Record<string, any> | string,
    headers: Record<string, string> = {}
  ) {
    return this.request(url, 'PATCH', headers, data);
  }

  /*
  createRequestMethod(method: string | undefined) {
    return (
      url: string | Request,
      headers: Record<string, string> | undefined,
      data:
        | string
        | FormData
        | URLSearchParams
        | Record<string, any>
        | null
        | undefined
    ) => this.request(url, method, headers, data);
  }
  */
}

/*
const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

methods.forEach((method) => {
  CustomFetch.prototype[method] =
    CustomFetch.prototype.createRequestMethod(method);
});
*/

export { CustomFetch as Fetch, CustomError };
export type { RequestOptions, Response };
export default CustomFetch.getInstance();

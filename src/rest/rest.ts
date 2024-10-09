import crypto from 'crypto';
import { snakeCase, camelCase } from 'change-case/keys';

interface RequestData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

function buildParams(data: RequestData) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach(item => params.append(`${key}[]`, item));
    } else {
      params.append(key, value);
    }
  }
  return params;
}

class RestHandler {
  #accessKey: string;
  #secretKey: string;
  #baseUrl: string;
  #namespace: string;
  #currentNonce = 0;
  #timeDiff = 0;

  constructor(baseUrl: string, namespace: string, accessKey: string, secretKey: string) {
    this.#baseUrl = baseUrl;
    this.#namespace = namespace;
    this.#accessKey = accessKey;
    this.#secretKey = secretKey;
  }

  setDiff(diff: number): void {
    this.#timeDiff = diff;
  }

  async makeRequest<T>(method: HttpMethod, path: string, data: RequestData = {}): Promise<T> {
    let nonce = Date.now() - this.#timeDiff;
    if (nonce === this.#currentNonce) nonce += 1
    this.#currentNonce = nonce;
    const sendData = snakeCase(data, Infinity) as RequestData;
    const payload = this.#createPayload(`${this.#namespace}${path}`, sendData, nonce);
    const signature = this.#createSignature(payload);

    const headers: HeadersInit = {
      'X-MAX-PAYLOAD': payload,
      'X-MAX-SIGNATURE': signature,
      'X-MAX-ACCESSKEY': this.#accessKey,
      'User-Agent': 'MAX Node/2.0.0',
      'Content-Type': 'application/json'
    };

    let url = `${this.#baseUrl}${this.#namespace}${path}`;
    const options: RequestInit = {
      method,
      headers
    };

    if (method === HttpMethod.GET) {
      const params = buildParams({ ...sendData, nonce: nonce.toString() });
      url += `?${params.toString()}`;
    } else {
      options.body = JSON.stringify({ ...sendData, nonce });
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${JSON.stringify(await response.json())}`);
      }
      const fetchResponse = await response.json();
      return camelCase(fetchResponse, Infinity) as T;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createPayload(path: string, data: RequestData, nonce: number): string {
    const payloadObj: RequestData = {
      path,
      nonce,
      ...data
    };

    const sortedPayload = Object.keys(payloadObj)
      .sort()
      .reduce<RequestData>((acc, key) => {
        acc[key] = payloadObj[key];
        return acc;
      }, {});
    return Buffer.from(JSON.stringify(sortedPayload)).toString('base64');
  }

  #createSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.#secretKey)
      .update(payload)
      .digest('hex');
  }

  #handleError(error: unknown): never {
    if (error instanceof Error) {
      if (error.message.includes('status: 401')) {
        throw new Error('Authentication failed');
      } else if (error.message.includes('status: 403')) {
        throw new Error('Authorization failed');
      } else if (error.message.startsWith('HTTP error!')) {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
    throw error;
  }

  async get<T>(path: string, params: RequestData = {}): Promise<T> {
    return this.makeRequest<T>(HttpMethod.GET, path, params);
  }

  async post<T>(path: string, data: RequestData = {}): Promise<T> {
    return this.makeRequest<T>(HttpMethod.POST, path, data);
  }

  async put<T>(path: string, data: RequestData = {}): Promise<T> {
    return this.makeRequest<T>(HttpMethod.PUT, path, data);
  }

  async delete<T>(path: string, data: RequestData = {}): Promise<T> {
    return this.makeRequest<T>(HttpMethod.DELETE, path, data);
  }

  async patch<T>(path: string, data: RequestData = {}): Promise<T> {
    return this.makeRequest<T>(HttpMethod.PATCH, path, data);
  }
}

export default RestHandler;

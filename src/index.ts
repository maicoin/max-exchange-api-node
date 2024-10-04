import { memoizeDecorator } from 'memoize';
import Rest from './rest/index.js';
import WebSocket from './ws/index.js';
import { WebSocketBook } from './ws/book.js';
import { MAXOptions } from './types.js';

const SUPPORTED_REST_VERSIONS = [2] as const;
type RestVersion = typeof SUPPORTED_REST_VERSIONS[number];

class MAX {
  #accessKey: string;
  #secretKey: string;

  constructor(options: MAXOptions) {
    this.#accessKey = options.accessKey;
    this.#secretKey = options.secretKey;
  }

  @memoizeDecorator()
  rest(version: RestVersion = 2): Rest {
    if (!SUPPORTED_REST_VERSIONS.includes(version)) {
      throw new Error(`Version ${version} is not supported, default version is 2.`);
    }
    return new Rest({
      accessKey: this.#accessKey,
      secretKey: this.#secretKey
    });
  }

  @memoizeDecorator()
  ws(): WebSocket {
    return new WebSocket({
      accessKey: this.#accessKey,
      secretKey: this.#secretKey
    });
  }
}

export { MAX, WebSocketBook };

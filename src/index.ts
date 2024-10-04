import Rest from './rest/index.js';
import WebSocket from './ws/index.js';
import { WebSocketBook } from './ws/book.js';
import { MAXOptions } from './types.js';

const SUPPORTED_REST_VERSIONS = [2] as const;
type RestVersion = typeof SUPPORTED_REST_VERSIONS[number];

class MAX {
  #accessKey: string;
  #secretKey: string;
  #rest: Rest | null;
  #ws: WebSocket | null;

  constructor(options: MAXOptions) {
    this.#accessKey = options.accessKey;
    this.#secretKey = options.secretKey;
    this.#rest = null;
    this.#ws = null;
  }

  get rest(): Rest {
    if (!this.#rest) {
      this.#rest = new Rest({
        accessKey: this.#accessKey,
        secretKey: this.#secretKey
      });
    }
    return this.#rest;
  }

  get ws() {
    if (!this.#ws) {
      this.#ws = new WebSocket({
        accessKey: this.#accessKey,
        secretKey: this.#secretKey
      });
    }
    return this.#ws;
  }
}

export { MAX, WebSocketBook, Rest };

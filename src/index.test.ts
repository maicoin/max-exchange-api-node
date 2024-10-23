import { describe, it, expect, vi, beforeEach } from 'vitest';

import Rest from './rest/index.js';
import WebSocket from './ws/index.js';

import { MAX } from './index.js';

// Mock the Rest and WebSocket classes
vi.mock('./rest/index.js', () => ({
  default: vi.fn(),
}));
vi.mock('./ws/index.js', () => ({
  default: vi.fn(),
}));

describe('MAX', () => {
  let max: MAX;

  beforeEach(() => {
    max = new MAX({ accessKey: 'testAccessKey', secretKey: 'testSecretKey' });
    vi.clearAllMocks();
  });

  describe('rest', () => {
    it('should create a new Rest instance with correct options', () => {
      const { rest } = max;
      expect(Rest).toHaveBeenCalledWith({
        accessKey: 'testAccessKey',
        secretKey: 'testSecretKey',
      });
      expect(rest).toBeInstanceOf(Rest);
    });

    it('should memoize the Rest instance', () => {
      const rest1 = max.rest;
      const rest2 = max.rest;
      expect(Rest).toHaveBeenCalledTimes(1);
      expect(rest1).toBe(rest2);
    });
  });

  describe('ws', () => {
    it('should create a new WebSocket instance with correct options', () => {
      const { ws } = max;
      expect(WebSocket).toHaveBeenCalledWith({
        accessKey: 'testAccessKey',
        secretKey: 'testSecretKey',
      });
      expect(ws).toBeInstanceOf(WebSocket);
    });

    it('should memoize the WebSocket instance', () => {
      const ws1 = max.ws;
      const ws2 = max.ws;
      expect(WebSocket).toHaveBeenCalledTimes(1);
      expect(ws1).toBe(ws2);
    });
  });
});

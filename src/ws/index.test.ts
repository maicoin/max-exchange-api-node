import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import WebSocketAPI from './index.js';
import WebSocket from 'ws';
import { z } from 'zod';

// Mock WebSocket
vi.mock('ws', () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
      readyState: WebSocket.OPEN,
    })),
    OPEN: 1,
    CLOSED: 3,
  };
});

describe('WebSocketAPI', () => {
  let api: WebSocketAPI;
  let mockWs: any;

  beforeEach(() => {
    api = new WebSocketAPI({ accessKey: 'test', secretKey: 'test' });
    (WebSocket as any).mockClear();
    api.connect();
    mockWs = (WebSocket as any).mock.results[0].value;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should validate channel input', () => {
      expect(() => api.subscribe('invalid_channel' as any, 'btcusd')).toThrow(z.ZodError);
    });

    it('should validate market input', () => {
      expect(() => api.subscribe('book', '')).toThrow(z.ZodError);
    });

    it('should validate depth for book channel', () => {
      expect(() => api.subscribe('book', 'btcusd', { depth: -100 })).toThrow(z.ZodError);
    });

    it('should send correct subscription message for book channel', () => {
      api.subscribe('book', 'btcusd', { depth: 5 });
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify({
        action: 'sub',
        subscriptions: [{ channel: 'book', market: 'btcusd', depth: 5 }]
      }));
    });

    it('should send correct subscription message for trade channel', () => {
      api.subscribe('trade', 'btcusd');
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify({
        action: 'sub',
        subscriptions: [{ channel: 'trade', market: 'btcusd' }]
      }));
    });
  });

  describe('unsubscribe', () => {
    it('should validate channel input', () => {
      expect(() => api.unsubscribe('invalid_channel' as any, 'btcusd')).toThrow(z.ZodError);
    });

    it('should validate market input', () => {
      expect(() => api.unsubscribe('book', '')).toThrow(z.ZodError);
    });

    it('should send correct unsubscription message', () => {
      api.unsubscribe('book', 'btcusd', { depth: 5 });
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify({
        action: 'unsub',
        subscriptions: [{ channel: 'book', market: 'btcusd', depth: 5 }]
      }));
    });
  });

//   describe('setFilters', () => {
//     it('should validate filter types', () => {
//       expect(() => api.setFilters(['invalid_filter' as any])).toThrow(z.ZodError);
//     });

//     // it('should set valid filters', () => {
//     //   api.setFilters(['order', 'trade']);
//     //   expect((api as any).#filters).toEqual(['order', 'trade']);
//     // });
//   });

  describe('connect', () => {
    it('should create a WebSocket connection', () => {
      expect(WebSocket).toHaveBeenCalledWith('wss://max-stream.maicoin.com/ws');
    });

    it('should set up event listeners', () => {
      expect(mockWs.on).toHaveBeenCalledWith('open', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should send authentication message when connected', () => {
      const openHandler = mockWs.on.mock.calls.find(call => call[0] === 'open')[1];
      openHandler();
      expect(mockWs.send).toHaveBeenCalledWith(expect.stringContaining('"action":"auth"'));
    });
  });

  describe('disconnect', () => {
    it('should close the WebSocket connection', () => {
      api.disconnect();
      expect(mockWs.close).toHaveBeenCalled();
    });
  });
});
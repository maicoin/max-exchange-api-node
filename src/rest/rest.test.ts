import crypto from 'crypto';

import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

import RestHandler from './rest.js';

// Mock fetch
global.fetch = vi.fn();

describe('RestHandler', () => {
  let handler: RestHandler;
  const mockBaseUrl = 'https://api.example.com';
  const mockNamespace = '/v3';
  const mockAccessKey = 'testAccessKey';
  const mockSecretKey = 'testSecretKey';

  beforeEach(() => {
    handler = new RestHandler(mockBaseUrl, mockNamespace, mockAccessKey, mockSecretKey);
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('makeRequest should make a GET request correctly', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handler.get('/test', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.example.com/v3/test?param=value'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'X-MAX-ACCESSKEY': mockAccessKey,
        }),
      })
    );
    expect(result).toEqual({ data: 'testData' });
  });

  test('makeRequest should make a POST request correctly', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handler.post('/test', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v3/test',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"param":"value"'),
        headers: expect.objectContaining({
          'X-MAX-ACCESSKEY': mockAccessKey,
        }),
      })
    );
    expect(result).toEqual({ data: 'testData' });
  });

  test('makeRequest should handle errors correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    });

    await expect(handler.get('/test')).rejects.toThrow('Authentication failed');
  });

  test('makeRequest should handle PUT requests correctly', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handler.put('/test', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v3/test',
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"param":"value"'),
        headers: expect.objectContaining({
          'X-MAX-ACCESSKEY': mockAccessKey,
        }),
      })
    );
    expect(result).toEqual({ data: 'testData' });
  });

  test('makeRequest should handle DELETE requests correctly', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handler.delete('/test', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v3/test',
      expect.objectContaining({
        method: 'DELETE',
        body: expect.stringContaining('"param":"value"'),
        headers: expect.objectContaining({
          'X-MAX-ACCESSKEY': mockAccessKey,
        }),
      })
    );
    expect(result).toEqual({ data: 'testData' });
  });

  test('makeRequest should handle PATCH requests correctly', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handler.patch('/test', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/v3/test',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('"param":"value"'),
        headers: expect.objectContaining({
          'X-MAX-ACCESSKEY': mockAccessKey,
        }),
      })
    );
    expect(result).toEqual({ data: 'testData' });
  });

  test('makeRequest should handle 403 errors correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Forbidden' }),
    });

    await expect(handler.get('/test')).rejects.toThrow('Authorization failed');
  });

  test('makeRequest should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(handler.get('/test')).rejects.toThrow('Network error');
  });

  test('setDiff should adjust the nonce correctly', async () => {
    const now = new Date('2023-01-01T00:00:00Z').getTime();
    vi.setSystemTime(now);

    handler.setDiff(1000); // Set a time difference of 1 second

    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await handler.get('/test');

    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toContain(`nonce=${now - 1000}`);
  });

  test('makeRequest should increment nonce for consecutive calls', async () => {
    const now = new Date('2023-01-01T00:00:00Z').getTime();
    vi.setSystemTime(now);

    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await handler.get('/test1');
    await handler.get('/test2');

    const [url1] = (global.fetch as any).mock.calls[0];
    const [url2] = (global.fetch as any).mock.calls[1];

    const nonce1 = new URLSearchParams(url1.split('?')[1]).get('nonce');
    const nonce2 = new URLSearchParams(url2.split('?')[1]).get('nonce');

    expect(Number(nonce2)).toBeGreaterThan(Number(nonce1));
  });

  test('makeRequest should create correct signature', async () => {
    const mockResponse = { data: 'testData' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await handler.get('/test');

    const [, options] = (global.fetch as any).mock.calls[0];
    const payload = options.headers['X-MAX-PAYLOAD'];
    const signature = options.headers['X-MAX-SIGNATURE'];

    const expectedSignature = crypto.createHmac('sha256', mockSecretKey).update(payload).digest('hex');

    expect(signature).toBe(expectedSignature);
  });
});

import { camelCase } from 'change-case/keys';
import { Decimal } from 'decimal.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZodError } from 'zod';


import { MAXOptions } from '../types.js';

import { convertToOrder } from './converter.js';
import RestHandler from './rest.js';
import { CancelAllOrdersParams, SubmitOrderParams } from './schema.js';
import type { Order } from './types.js';

import MaxSDK from './index.js';

vi.mock('./rest');

describe('MaxSDK Order Methods - Part 1', () => {
  let maxSDK: MaxSDK;
  let mockRestHandler: any;

  beforeEach(() => {
    const options: MAXOptions = {
      accessKey: 'testAccessKey',
      secretKey: 'testSecretKey',
    };
    maxSDK = new MaxSDK(options);
    mockRestHandler = vi.mocked(RestHandler.prototype);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOrder: Order = {
    id: 123456,
    walletType: 'spot',
    market: 'btctwd',
    side: 'buy',
    ordType: 'limit',
    price: new Decimal('50000'),
    stopPrice: null,
    avgPrice: new Decimal('0'),
    state: 'wait',
    volume: new Decimal('0.1'),
    remainingVolume: new Decimal('0.1'),
    executedVolume: new Decimal('0'),
    tradesCount: 0,
    clientOid: null,
    groupId: null,
    createdAt: new Date(1644572610000),
    updatedAt: new Date(1644572610000),
  };

  describe('getOpenOrders', () => {
    it('should return open orders with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      const mockOpenOrders: Order[] = [mockOrder];

      mockRestHandler.get.mockResolvedValue(mockOpenOrders);

      const result = await maxSDK.getOpenOrders('spot', params);

      expect(result).toEqual(mockOpenOrders);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((order) => {
        expect(order).toMatchObject(mockOrder);
        expect(typeof order.id).toBe('number');
        expect(typeof order.walletType).toBe('string');
        expect(typeof order.market).toBe('string');
        expect(['buy', 'sell']).toContain(order.side);
        // expect(typeof order.price).toBe('string');
        expect(order.price instanceof Decimal).toBe(true);
        // expect(typeof order.volume).toBe('string');
        // expect(typeof order.createdAt).toBe('number');
        // expect(typeof order.updatedAt).toBe('number');
        expect(order.volume instanceof Decimal).toBe(true);
        expect(order.createdAt instanceof Date).toBe(true);
        expect(order.updatedAt instanceof Date).toBe(true);
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { market: 'btctwd', limit: 'invalid' };

      await expect(maxSDK.getOpenOrders('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getOpenOrders('spot', params)).rejects.toThrow('Network Error');
    });
  });

  describe('getCloseOrders', () => {
    it('should return closed orders with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      const mockClosedOrders: Order[] = await import('../../tests/fixtures/ordersClosed.json').then((result) =>
        (camelCase(result.default, Infinity) as any).map(convertToOrder)
      );

      mockRestHandler.get.mockResolvedValue(mockClosedOrders);

      const result = await maxSDK.getClosedOrders('spot', params);
      expect(result).toEqual(mockClosedOrders);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((order) => {
        // expect(order).toMatchObject({ ...mockOrder, state: 'done' });
        expect(typeof order.id).toBe('number');
        expect(typeof order.walletType).toBe('string');
        expect(typeof order.market).toBe('string');
        expect(['buy', 'sell']).toContain(order.side);
        if (order.price === null) {
          expect(order.price).toBe(null);
        } else {
          expect(order.price instanceof Decimal).toBe(true);
        }
        expect(order.volume instanceof Decimal).toBe(true);
        expect(order.createdAt instanceof Date).toBe(true);
        expect(order.updatedAt instanceof Date).toBe(true);
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { market: 'btctwd', limit: 'invalid' };

      await expect(maxSDK.getClosedOrders('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getClosedOrders('spot', params)).rejects.toThrow('Network Error');
    });
  });

  describe('getOrderHistory', () => {
    it('should return order history with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      const mockOrderHistory: Order[] = [mockOrder, { ...mockOrder, id: 123457, state: 'done' }];

      mockRestHandler.get.mockResolvedValue(mockOrderHistory);

      const result = await maxSDK.getOrderHistory('spot', params);

      expect(result).toEqual(mockOrderHistory);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((order) => {
        expect(order).toMatchObject(
          expect.objectContaining({
            id: expect.any(Number),
            walletType: expect.any(String),
            market: expect.any(String),
            side: expect.stringMatching(/buy|sell/),
            price: expect.any(Decimal),
            volume: expect.any(Decimal),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          })
        );
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { market: 'btctwd', limit: 'invalid' };

      await expect(maxSDK.getOrderHistory('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getOrderHistory('spot', params)).rejects.toThrow('Network Error');
    });
  });

  describe('submitOrder', () => {
    it('should submit an order and return order details', async () => {
      const params: SubmitOrderParams = {
        market: 'btctwd',
        side: 'buy',
        volume: '0.1',
        price: '50000',
      };

      mockRestHandler.post.mockResolvedValue(mockOrder);

      const result = await maxSDK.submitOrder('spot', params);

      expect(result).toEqual(mockOrder);
      expect(result).toMatchObject({
        id: expect.any(Number),
        walletType: 'spot',
        market: 'btctwd',
        side: 'buy',
        price: new Decimal('50000'),
        volume: new Decimal('0.1'),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 'btctwd',
        side: 'invalid',
        volume: '0.1',
        price: '50000',
      };

      await expect(maxSDK.submitOrder('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: SubmitOrderParams = {
        market: 'btctwd',
        side: 'buy',
        volume: '0.1',
        price: '50000',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.submitOrder('spot', params)).rejects.toThrow('Network Error');
    });
  });
});

describe('MaxSDK Order Methods', () => {
  let maxSDK: MaxSDK;
  let mockRestHandler: any;

  beforeEach(() => {
    const options: MAXOptions = {
      accessKey: 'testAccessKey',
      secretKey: 'testSecretKey',
    };
    maxSDK = new MaxSDK(options);
    mockRestHandler = vi.mocked(RestHandler.prototype);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOrder: Order = {
    id: 123456,
    walletType: 'spot',
    market: 'btctwd',
    side: 'buy',
    ordType: 'limit',
    price: new Decimal('50000'),
    stopPrice: null,
    avgPrice: new Decimal('0'),
    state: 'wait',
    volume: new Decimal('0.1'),
    remainingVolume: new Decimal('0.1'),
    executedVolume: new Decimal('0'),
    tradesCount: 0,
    clientOid: null,
    groupId: null,
    createdAt: new Date(1644572610000),
    updatedAt: new Date(1644572610000),
  };

  describe('cancelAllOrders', () => {
    it('should cancel all orders and return success status', async () => {
      const params: CancelAllOrdersParams = {
        market: 'btctwd',
        side: 'buy',
      };

      const mockResponse = [{ success: true }, { success: true }];

      mockRestHandler.delete.mockResolvedValue(mockResponse);

      const result = await maxSDK.cancelAllOrders('spot', params);

      expect(result).toEqual(mockResponse);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item).toHaveProperty('success');
        expect(typeof item.success).toBe('boolean');
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 'btctwd',
        side: 'invalid',
      };

      await expect(maxSDK.cancelAllOrders('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: CancelAllOrdersParams = {
        market: 'btctwd',
        side: 'buy',
      };

      mockRestHandler.delete.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.cancelAllOrders('spot', params)).rejects.toThrow('Network Error');
    });
  });

  describe('getOrder', () => {
    it('should return order details with correct structure', async () => {
      const params = {
        id: 123456,
      };

      mockRestHandler.get.mockResolvedValue(mockOrder);

      const result = await maxSDK.getOrder(params);

      expect(result).toEqual(mockOrder);
      expect(result).toMatchObject({
        id: expect.any(Number),
        walletType: expect.any(String),
        market: expect.any(String),
        side: expect.stringMatching(/buy|sell/),
        price: expect.any(Decimal),
        volume: expect.any(Decimal),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        id: 'invalid',
      };

      await expect(maxSDK.getOrder(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        id: 123456,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getOrder(params)).rejects.toThrow('Network Error');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order and return success status', async () => {
      const params = {
        id: 123456,
      };

      const mockResponse = { success: true };

      mockRestHandler.delete.mockResolvedValue(mockResponse);

      const result = await maxSDK.cancelOrder(params);

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        id: 'invalid',
      };

      await expect(maxSDK.cancelOrder(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        id: 123456,
      };

      mockRestHandler.delete.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.cancelOrder(params)).rejects.toThrow('Network Error');
    });
  });
});

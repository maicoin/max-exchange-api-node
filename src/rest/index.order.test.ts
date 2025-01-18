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

describe('MaxSDK', () => {
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

  const mockSpotOrder: Order = {
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

  const mockMOrder: Order = { ...mockSpotOrder, walletType: 'm' };

  describe('Spot Wallet Methods', () => {
    describe('getOpenOrders', () => {
      it('should return open orders with correct structure', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        const mockOpenOrders: Order[] = [mockSpotOrder];

        mockRestHandler.get.mockResolvedValue(mockOpenOrders);

        const result = await maxSDK.spotWallet.getOpenOrders(params);

        expect(result).toEqual(mockOpenOrders);
        expect(Array.isArray(result)).toBe(true);
        result.forEach((order) => {
          expect(order).toMatchObject(mockSpotOrder);
          expect(typeof order.id).toBe('number');
          expect(order.walletType).toBe('spot');
          expect(typeof order.market).toBe('string');
          expect(['buy', 'sell']).toContain(order.side);
          expect(order.price instanceof Decimal).toBe(true);
          expect(order.volume instanceof Decimal).toBe(true);
          expect(order.createdAt instanceof Date).toBe(true);
          expect(order.updatedAt instanceof Date).toBe(true);
        });
      });

      it('should throw ZodError for invalid input', async () => {
        const invalidParams = { market: 'btctwd', limit: 'invalid' };

        await expect(maxSDK.spotWallet.getOpenOrders(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.spotWallet.getOpenOrders(params)).rejects.toThrow('Network Error');
      });
    });

    describe('getClosedOrders', () => {
      it('should return closed orders with correct structure', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        const mockClosedOrders: Order[] = await import('../../tests/fixtures/ordersClosed.json').then((result) =>
          (camelCase(result.default, Infinity) as any).map(convertToOrder)
        );

        mockRestHandler.get.mockResolvedValue(mockClosedOrders);

        const result = await maxSDK.spotWallet.getClosedOrders(params);
        expect(result).toEqual(mockClosedOrders);
        expect(Array.isArray(result)).toBe(true);
        result.forEach((order) => {
          expect(typeof order.id).toBe('number');
          expect(order.walletType).toBe('spot');
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

        await expect(maxSDK.spotWallet.getClosedOrders(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.spotWallet.getClosedOrders(params)).rejects.toThrow('Network Error');
      });
    });

    describe('getOrderHistory', () => {
      it('should return order history with correct structure', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        const mockOrderHistory: Order[] = [mockSpotOrder, { ...mockSpotOrder, id: 123457, state: 'done' }];

        mockRestHandler.get.mockResolvedValue(mockOrderHistory);

        const result = await maxSDK.spotWallet.getOrderHistory(params);

        expect(result).toEqual(mockOrderHistory);
        expect(Array.isArray(result)).toBe(true);
        result.forEach((order) => {
          expect(order).toMatchObject(
            expect.objectContaining({
              id: expect.any(Number),
              walletType: 'spot',
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

        await expect(maxSDK.spotWallet.getOrderHistory(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.spotWallet.getOrderHistory(params)).rejects.toThrow('Network Error');
      });
    });

    describe('submitOrder', () => {
      it('should submit an order and return order details', async () => {
        const params: SubmitOrderParams = {
          market: 'btctwd',
          side: 'buy',
          volume: '0.1',
          price: '50000',
          ord_type: 'iocLimit',
        };

        mockRestHandler.post.mockResolvedValue(mockSpotOrder);

        const result = await maxSDK.spotWallet.submitOrder(params);

        expect(result).toEqual(mockSpotOrder);
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

        await expect(maxSDK.spotWallet.submitOrder(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params: SubmitOrderParams = {
          market: 'btctwd',
          side: 'buy',
          volume: '0.1',
          price: '50000',
        };

        mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.spotWallet.submitOrder(params)).rejects.toThrow('Network Error');
      });

      it('should convert params to snake_case when submitting order', async () => {
        const params: SubmitOrderParams = {
          market: 'btctwd',
          side: 'buy',
          volume: '0.1',
          price: '50000',
          ord_type: 'iocLimit',
          stop_price: '48000',
        };

        mockRestHandler.post.mockResolvedValue(mockSpotOrder);

        await maxSDK.spotWallet.submitOrder(params);

        // Verify the post call received snake_case parameters
        expect(mockRestHandler.post).toHaveBeenCalledWith(
          '/wallet/spot/order',
          expect.objectContaining({
            market: 'btctwd',
            side: 'buy',
            volume: '0.1',
            price: '50000',
            ord_type: 'ioc_limit',
            stop_price: '48000',    // should be converted to snake_case
          })
        );
      });
    });
    describe('cancelAllOrders', () => {
      it('should cancel all orders and return success status', async () => {
        const params: CancelAllOrdersParams = {
          market: 'btctwd',
          side: 'buy',
        };

        const mockResponse = [{ success: true }, { success: true }];

        mockRestHandler.delete.mockResolvedValue(mockResponse);

        const result = await maxSDK.spotWallet.cancelAllOrders(params);

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

        await expect(maxSDK.spotWallet.cancelAllOrders(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params: CancelAllOrdersParams = {
          market: 'btctwd',
          side: 'buy',
        };

        mockRestHandler.delete.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.spotWallet.cancelAllOrders(params)).rejects.toThrow('Network Error');
      });
    });
  });

  describe('M Wallet Methods', () => {
    describe('getOpenOrders', () => {
      it('should return open orders for mWallet with correct structure', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        const mockOpenOrders: Order[] = [mockMOrder];

        mockRestHandler.get.mockResolvedValue(mockOpenOrders);

        const result = await maxSDK.mWallet.getOpenOrders(params);

        expect(result).toEqual(mockOpenOrders);
        expect(Array.isArray(result)).toBe(true);
        result.forEach((order) => {
          expect(order.walletType).toBe('m');
          expect(order.price instanceof Decimal).toBe(true);
          expect(order.volume instanceof Decimal).toBe(true);
          expect(order.createdAt instanceof Date).toBe(true);
          expect(order.updatedAt instanceof Date).toBe(true);
        });
      });

      it('should throw ZodError for invalid input', async () => {
        const invalidParams = { market: 'btctwd', limit: 'invalid' };

        await expect(maxSDK.mWallet.getOpenOrders(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params = {
          market: 'btctwd',
          limit: 10,
        };

        mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.mWallet.getOpenOrders(params)).rejects.toThrow('Network Error');
      });
    });

    describe('submitOrder', () => {
      it('should submit an order for mWallet and return order details', async () => {
        const params: SubmitOrderParams = {
          market: 'btctwd',
          side: 'buy',
          volume: '0.1',
          price: '50000',
        };

        mockRestHandler.post.mockResolvedValue(mockMOrder);

        const result = await maxSDK.mWallet.submitOrder(params);

        expect(result).toEqual(mockMOrder);
        expect(result.walletType).toBe('m');
        expect(result.price instanceof Decimal).toBe(true);
        expect(result.volume instanceof Decimal).toBe(true);
        expect(result.createdAt instanceof Date).toBe(true);
        expect(result.updatedAt instanceof Date).toBe(true);
      });

      it('should throw ZodError for invalid input', async () => {
        const invalidParams = {
          market: 'btctwd',
          side: 'invalid',
          volume: '0.1',
          price: '50000',
        };

        await expect(maxSDK.mWallet.submitOrder(invalidParams as any)).rejects.toThrow(ZodError);
      });

      it('should handle network errors', async () => {
        const params: SubmitOrderParams = {
          market: 'btctwd',
          side: 'buy',
          volume: '0.1',
          price: '50000',
        };

        mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

        await expect(maxSDK.mWallet.submitOrder(params)).rejects.toThrow('Network Error');
      });
    });


    // describe('Wallet-specific Methods', () => {
    //   describe('submitRepayment', () => {
    //     const mockRepayment: ManualRepayment = {
    //       currency: 'btc',
    //       amount: new Decimal('0.05'),
    //       principal: new Decimal('0.049'),
    //       interest: new Decimal('0.001'),
    //       state: 'confirmed',
    //       sn: '654321',
    //       createdAt: new Date(1644572610000),
    //     };

    //     it('should submit a repayment for mWallet and return repayment details', async () => {
    //       const params = {
    //         currency: 'btc',
    //         amount: '0.05',
    //       };

    //       mockRestHandler.post.mockResolvedValue(mockRepayment);

    //       const result = await maxSDK.mWallet.submitRepayment(params);

    //       expect(result).toEqual(mockRepayment);
    //       expect(result.amount instanceof Decimal).toBe(true);
    //       expect(result.principal instanceof Decimal).toBe(true);
    //       expect(result.interest instanceof Decimal).toBe(true);
    //       expect(result.createdAt instanceof Date).toBe(true);
    //     });

    //     it('should throw an error when trying to submit repayment for spot wallet', async () => {
    //       const params = {
    //         currency: 'btc',
    //         amount: '0.05',
    //       };

    //       await expect(maxSDK.spotWallet.submitRepayment(params)).rejects.toThrow();
    //     });

    //     it('should throw ZodError for invalid input', async () => {
    //       const invalidParams = {
    //         currency: 'invalid',
    //         amount: 'not a number',
    //       };

    //       await expect(maxSDK.mWallet.submitRepayment(invalidParams as any)).rejects.toThrow(ZodError);
    //     });

    //     it('should handle network errors', async () => {
    //       const params = {
    //         currency: 'btc',
    //         amount: '0.05',
    //       };

    //       mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

    //       await expect(maxSDK.mWallet.submitRepayment(params)).rejects.toThrow('Network Error');
    //     });
    //   });
    // });

    describe('Common Methods', () => {
      describe('getOrder', () => {
        it('should return order details with correct structure', async () => {
          const params = {
            id: 123456,
          };

          mockRestHandler.get.mockResolvedValue(mockSpotOrder);

          const result = await maxSDK.getOrder(params);

          expect(result).toEqual(mockSpotOrder);
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
  })
});
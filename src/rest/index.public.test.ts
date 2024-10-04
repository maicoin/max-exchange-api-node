import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MaxSDK from './index.js';
import { MAXOptions } from '../types.js';
import RestHandler from './rest.js';
import type { Timestamp } from './types.js';
import type { Depth, Ticker } from './types.js';
import { ZodError } from 'zod';
import { camelCase } from 'change-case/keys';
import Decimal from 'decimal.js/decimal.mjs';
import { convertToBorrowingLimits, convertToCurrency, convertToIndexPrices, convertToInterestRate, convertToKLine, convertToMarket, convertToPublicTrade, convertToTicker } from './converter.js';

vi.mock('./rest');

describe('MaxSDK Public Methods Test', () => {
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

  describe('getIndexPrices', () => {
    it('should return index prices with correct structure', async () => {
      const mockIndexPrices: any = await import('../../tests/fixtures/indexPrices.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockIndexPrices);
      const result = await maxSDK.getIndexPrices();
      // TODO
      expect(result).toEqual(convertToIndexPrices(mockIndexPrices));
      Object.entries(result).forEach(([key, value]) => {
        expect(value).toBeInstanceOf(Decimal);
      });
    });

    it('should handle empty response', async () => {
      mockRestHandler.get.mockResolvedValue({});
      const result = await maxSDK.getIndexPrices();
      expect(result).toEqual({});
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getIndexPrices()).rejects.toThrow('Network Error');
    });
  });

  describe('getLimits', () => {
    it('should return borrowing limits with correct structure', async () => {
      const mockLimits: any = await import('../../tests/fixtures/limits.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockLimits);

      const result = await maxSDK.getLimits();
      expect(result).toEqual(convertToBorrowingLimits(mockLimits));
      Object.entries(result).forEach(([key, value]) => {
        expect(value).toBeInstanceOf(Decimal);
      });
    });

    it('should handle empty response', async () => {
      mockRestHandler.get.mockResolvedValue({});
      const result = await maxSDK.getLimits();
      expect(result).toEqual({});
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getLimits()).rejects.toThrow('Network Error');
    });
  });

  describe('getInterestRates', () => {
    it('should return interest rates with correct structure', async () => {
      const mockInterestRates: any = await import('../../tests/fixtures/interestRates.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockInterestRates);

      const result = await maxSDK.getInterestRates();
      expect(result).toEqual(convertToInterestRate(mockInterestRates));
      Object.entries(result).forEach(([key, value]) => {
        expect(value).toMatchObject({
          hourlyInterestRate: expect.any(Decimal),
          nextHourlyInterestRate: expect.any(Decimal),
        });
      });
    });

    it('should handle empty response', async () => {
      mockRestHandler.get.mockResolvedValue({});
      const result = await maxSDK.getInterestRates();
      expect(result).toEqual({});
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getInterestRates()).rejects.toThrow('Network Error');
    });
  });

  describe('getMarkets', () => {
    it('should return markets with correct structure', async () => {
      const mockMarkets: any = await import('../../tests/fixtures/markets.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockMarkets);

      const result = await maxSDK.getMarkets();
      expect(result).toEqual(mockMarkets.map(convertToMarket));
      expect(Array.isArray(result)).toBe(true);
      result.forEach(market => {
        expect(market).toMatchObject({
          id: expect.any(String),
          status: expect.any(String),
          baseUnit: expect.any(String),
          baseUnitPrecision: expect.any(Number),
          minBaseAmount: expect.any(Decimal),
          quoteUnit: expect.any(String),
          quoteUnitPrecision: expect.any(Number),
          minQuoteAmount: expect.any(Decimal),
          mWalletSupported: expect.any(Boolean),
        });
      });
    });

    it('should handle empty response', async () => {
      mockRestHandler.get.mockResolvedValue([]);
      const result = await maxSDK.getMarkets();
      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getMarkets()).rejects.toThrow('Network Error');
    });
  });

  describe('getCurrencies', () => {
    it('should return currencies with correct structure', async () => {
      const mockCurrencies: any = await import('../../tests/fixtures/currencies.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockCurrencies);

      const result = await maxSDK.getCurrencies();

      expect(result).toEqual(mockCurrencies.map(convertToCurrency));
      expect(Array.isArray(result)).toBe(true);
      result.forEach(currency => {
        expect(currency).toMatchObject({
          currency: expect.any(String),
          type: expect.any(String),
          precision: expect.any(Number),
          mWalletSupported: expect.any(Boolean),
          mWalletMortgageable: expect.any(Boolean),
          mWalletBorrowable: expect.any(Boolean),
          // minBorrowAmount: expect.any(Decimal || null) ,
          networks: expect.any(Array),
          staking: expect.any(Object),
        });
        if (currency.minBorrowAmount === null) {
          expect(currency.minBorrowAmount).toBeNull();
        } else {
          expect(currency.minBorrowAmount).toBeInstanceOf(Decimal);
        }
      });
    });

    it('should handle empty response', async () => {
      mockRestHandler.get.mockResolvedValue([]);
      const result = await maxSDK.getCurrencies();
      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getCurrencies()).rejects.toThrow('Network Error');
    });
  });

  describe('getTimestamp', () => {
    it('should return timestamp with correct structure', async () => {
      const mockTimestamp: Timestamp = await import('../../tests/fixtures/timestamp.json').then((result) => {
        return camelCase(result.default, Infinity) as Timestamp;
      });

      mockRestHandler.get.mockResolvedValue(mockTimestamp);

      const result = await maxSDK.getTimestamp();

      expect(result).toMatchObject({
        timestamp: expect.any(Date),
      });
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getTimestamp()).rejects.toThrow('Network Error');
    });
  });

  describe('getKLine', () => {
    it('should return K-line data with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
        period: 1,
      };

      const mockKLineData: any = await import('../../tests/fixtures/kline.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockKLineData);

      const result = await maxSDK.getKLine(params);
      expect(result).toEqual(convertToKLine(mockKLineData));
      expect(Array.isArray(result)).toBe(true);
      result.forEach(kline => {
        expect(kline).toEqual(expect.arrayContaining([
          expect.any(Date),
          expect.any(Decimal),
          expect.any(Decimal),
          expect.any(Decimal),
          expect.any(Decimal),
          expect.any(Decimal),
        ]));
        expect(kline).toHaveLength(6);
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 'btctwd',
        limit: 'invalid',
        period: 1,
      };

      await expect(maxSDK.getKLine(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
        period: 1,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getKLine(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getDepth', () => {
    it('should return market depth with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 5,
      };

      const mockDepth: Depth = await import('../../tests/fixtures/depth.json').then((result) => {
        return camelCase(result.default, Infinity) as Depth;
      });

      mockRestHandler.get.mockResolvedValue(mockDepth);

      const result = await maxSDK.getDepth(params);

      expect(result).toMatchObject({
        timestamp: expect.any(Date),
        lastUpdateVersion: expect.any(Number),
        lastUpdateId: expect.any(Number),
        asks: expect.any(Array),
        bids: expect.any(Array),
      });

      // result.asks.forEach(ask => {
      //   expect(ask).toEqual([expect.any(Decimal), expect.any(Decimal)]);
      // });

      // result.bids.forEach(bid => {
      //   expect(bid).toEqual([expect.any(Decimal), expect.any(Decimal)]);
      // });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 'btctwd',
        limit: 'invalid',
      };

      await expect(maxSDK.getDepth(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 5,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getDepth(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getPublicTrades', () => {
    it('should return public trades with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 5,
      };

      const mockPublicTrades: any = await import('../../tests/fixtures/publicTrades.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockPublicTrades);

      const result = await maxSDK.getPublicTrades(params);

      expect(result).toEqual(mockPublicTrades.map(convertToPublicTrade));
      expect(Array.isArray(result)).toBe(true);
      result.forEach(trade => {
        expect(trade).toMatchObject({
          id: expect.any(Number),
          price: expect.any(Decimal),
          volume: expect.any(Decimal),
          funds: expect.any(Decimal),
          market: expect.any(String),
          side: expect.stringMatching(/^(bid|ask)$/),
          createdAt: expect.any(Date),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 'btctwd',
        limit: 'invalid',
      };

      await expect(maxSDK.getPublicTrades(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 5,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getPublicTrades(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getTickers', () => {
    it('should return tickers with correct structure', async () => {
      const params = {
        markets: ['btctwd', 'ethtwd'],
      };

      const mockTickers: any = await import('../../tests/fixtures/tickers.json').then((result) => {
        return camelCase(result.default, Infinity);
      });

      mockRestHandler.get.mockResolvedValue(mockTickers);

      const result = await maxSDK.getTickers(params);

      expect(result).toEqual(mockTickers.map(convertToTicker));
      expect(Array.isArray(result)).toBe(true);
      result.forEach(ticker => {
        expect(ticker).toMatchObject({
          market: expect.any(String),
          at: expect.any(Date),
          buy: expect.any(Decimal),
          buyVol: expect.any(Decimal),
          sell: expect.any(Decimal),
          sellVol: expect.any(Decimal),
          open: expect.any(Decimal),
          low: expect.any(Decimal),
          high: expect.any(Decimal),
          last: expect.any(Decimal),
          vol: expect.any(Decimal),
          volInBtc: expect.any(Decimal),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        markets: 'invalid',
      };

      await expect(maxSDK.getTickers(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        markets: ['btctwd', 'ethtwd'],
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getTickers(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getTicker', () => {
    it('should return a ticker with correct structure', async () => {
      const params = {
        market: 'btctwd',
      };

      const mockTicker: Ticker = await import('../../tests/fixtures/ticker.json').then((result) => {
        return camelCase(result.default, Infinity) as Ticker;
      });

      mockRestHandler.get.mockResolvedValue(mockTicker);

      const result = await maxSDK.getTicker(params);

      expect(result).toMatchObject({
        market: expect.any(String),
        at: expect.any(Date),
        buy: expect.any(Decimal),
        buyVol: expect.any(Decimal),
        sell: expect.any(Decimal),
        sellVol: expect.any(Decimal),
        open: expect.any(Decimal),
        low: expect.any(Decimal),
        high: expect.any(Decimal),
        last: expect.any(Decimal),
        vol: expect.any(Decimal),
        volInBtc: expect.any(Decimal),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        market: 123,
      };

      await expect(maxSDK.getTicker(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
      await expect(maxSDK.getTicker(params)).rejects.toThrow('Network Error');
    });
  });
});

describe('MaxSDK calibrateTime', () => {
  let maxSDK: MaxSDK;
  let mockRestHandler: any;
  let originalDateNow: typeof Date.now;

  beforeEach(() => {
    const options: MAXOptions = {
      accessKey: 'testAccessKey',
      secretKey: 'testSecretKey',
    };
    maxSDK = new MaxSDK(options);
    mockRestHandler = vi.mocked(RestHandler.prototype);

    // 保存原始的 Date.now 方法
    originalDateNow = Date.now;
  });

  afterEach(() => {
    vi.clearAllMocks();
    // 恢复原始的 Date.now 方法
    Date.now = originalDateNow;
  });

  it('should not calibrate time when difference is less than 30 seconds', async () => {
    const serverTime = 1644572610;
    const localTime = 1644572615000; // 5 seconds difference

    mockRestHandler.get.mockResolvedValue({ timestamp: serverTime });
    Date.now = vi.fn(() => localTime);

    const result = await maxSDK.calibrateTime();

    expect(result).toBe('Local Time is synced.');
    expect(mockRestHandler.setDiff).not.toHaveBeenCalled();
  });

  it('should calibrate time when difference is more than 30 seconds', async () => {
    const serverTime = 1644572610;
    const localTime = 1644572650000; // 40 seconds difference

    mockRestHandler.get.mockResolvedValue({ timestamp: serverTime });
    Date.now = vi.fn(() => localTime);

    const result = await maxSDK.calibrateTime();

    expect(result).toBe('Local Time synced, diff was 40000 ms.');
    expect(mockRestHandler.setDiff).toHaveBeenCalledWith(40000);
  });

  it('should calibrate time when local time is behind server time', async () => {
    const serverTime = 1644572650;
    const localTime = 1644572610000; // 40 seconds behind

    mockRestHandler.get.mockResolvedValue({ timestamp: serverTime });
    Date.now = vi.fn(() => localTime);

    const result = await maxSDK.calibrateTime();

    expect(result).toBe('Local Time synced, diff was -40000 ms.');
    expect(mockRestHandler.setDiff).toHaveBeenCalledWith(-40000);
  });

  it('should handle network errors', async () => {
    mockRestHandler.get.mockRejectedValue(new Error('Network Error'));
    await expect(maxSDK.calibrateTime()).rejects.toThrow('Network Error');
  });

  // it('should handle unexpected server response', async () => {
  //   mockRestHandler.get.mockResolvedValue({});
  //   await expect(maxSDK.calibrateTime()).rejects.toThrow('Unexpected server response');
  // });
});

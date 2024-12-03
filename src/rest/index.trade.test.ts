import { camelCase } from 'change-case/keys';
import { Decimal } from 'decimal.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZodError } from 'zod';


import { MAXOptions } from '../types.js';


import {
  convertToBorrowingTransfer,
  convertToDeposit,
  convertToInternalTransfer,
  convertToTrade,
  convertToWithdrawal,
} from './converter.js';
import RestHandler from './rest.js';
import {
  GetInternalTransfersParams,
  GetRewardsParams,
  GetTransfersParams,
  TransferBetweenWalletsParams,
} from './schema.js';
import type { BorrowingTransfer, Withdrawal, Deposit, Reward } from './types.js';

import MaxSDK from './index.js';

vi.mock('./rest');

describe('MaxSDK Trade Methods - Part 1', () => {
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

  describe('getTrades', () => {
    it('should return trades with correct structure', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      const mockTrades: any = await import('../../tests/fixtures/spotTrades.json').then((result) => camelCase(result.default, Infinity));

      mockRestHandler.get.mockResolvedValue(mockTrades);

      const result = await maxSDK.spotWallet.getTrades(params);

      expect(result).toEqual(mockTrades.map(convertToTrade));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((trade) => {
        expect(trade).toMatchObject({
          id: expect.any(Number),
          orderId: expect.any(Number),
          walletType: expect.any(String),
          price: expect.any(Decimal),
          volume: expect.any(Decimal),
          funds: expect.any(Decimal),
          market: expect.any(String),
          marketName: expect.any(String),
          side: expect.any(String),
          fee: expect.any(Decimal),
          feeCurrency: expect.any(String),
          feeDiscounted: expect.any(Boolean),
          liquidity: expect.any(String),
          createdAt: expect.any(Date),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { market: 'btctwd', limit: 'invalid' };

      await expect(maxSDK.spotWallet.getTrades(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        market: 'btctwd',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.spotWallet.getTrades(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getOrderTrades', () => {
    it('should return order trades with correct structure', async () => {
      const params = {
        orderId: 78910,
      };

      const mockOrderTrades: any = await import('../../tests/fixtures/spotTrades.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockResolvedValue(mockOrderTrades);

      const result = await maxSDK.getOrderTrades(params);

      expect(result).toEqual(mockOrderTrades.map(convertToTrade));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((trade) => {
        expect(trade).toMatchObject({
          id: expect.any(Number),
          orderId: expect.any(Number),
          walletType: expect.any(String),
          price: expect.any(Decimal),
          volume: expect.any(Decimal),
          funds: expect.any(Decimal),
          market: expect.any(String),
          marketName: expect.any(String),
          side: expect.any(String),
          fee: expect.any(Decimal),
          feeCurrency: expect.any(String),
          feeDiscounted: expect.any(Boolean),
          liquidity: expect.any(String),
          createdAt: expect.any(Date),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { orderId: 'invalid' };

      await expect(maxSDK.getOrderTrades(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        orderId: 78910,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getOrderTrades(params)).rejects.toThrow('Network Error');
    });
  });

  describe('transferBetweenWallets', () => {
    it('should transfer between wallets and return correct structure', async () => {
      const params: TransferBetweenWalletsParams = {
        currency: 'btc',
        amount: '0.1',
        side: 'in',
      };

      const mockTransfer: BorrowingTransfer = {
        sn: 'xxxxx',
        side: 'in',
        currency: 'btc',
        amount: new Decimal('0.1'),
        createdAt: new Date(1644572610000),
        state: 'done',
      };

      mockRestHandler.post.mockResolvedValue(mockTransfer);

      const result = await maxSDK.transferBetweenWallets(params);

      expect(result).toEqual(mockTransfer);
      expect(result).toMatchObject({
        sn: expect.any(String),
        side: expect.any(String),
        currency: expect.any(String),
        amount: expect.any(Decimal),
        createdAt: expect.any(Date),
        state: expect.any(String),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', amount: 0.1, side: 'invalid' };

      await expect(maxSDK.transferBetweenWallets(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: TransferBetweenWalletsParams = {
        currency: 'btc',
        amount: '0.1',
        side: 'in',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.transferBetweenWallets(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getTransfers', () => {
    it('should return transfers with correct structure', async () => {
      const params: GetTransfersParams = {
        currency: 'btc',
        side: 'in',
        limit: 10,
      };

      const mockTransfers: any = await import('../../tests/fixtures/transfers.json').then((result) => camelCase(result.default, Infinity));

      mockRestHandler.get.mockResolvedValue(mockTransfers);

      const result = await maxSDK.getTransfers(params);

      expect(result).toEqual(mockTransfers.map(convertToBorrowingTransfer));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((transfer) => {
        expect(transfer).toMatchObject({
          sn: expect.any(String),
          side: expect.any(String),
          currency: expect.any(String),
          amount: expect.any(Decimal),
          createdAt: expect.any(Date),
          state: expect.any(String),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', side: 'invalid', limit: 10 };

      await expect(maxSDK.getTransfers(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: GetTransfersParams = {
        currency: 'btc',
        side: 'in',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getTransfers(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getWithdrawal', () => {
    it('should return withdrawal details with correct structure', async () => {
      const params = {
        uuid: 'xxxxx',
      };

      const mockWithdrawal: Withdrawal = {
        uuid: 'xxxxx',
        currency: 'btc',
        networkProtocol: 'bitcoin',
        amount: new Decimal('0.1'),
        fee: new Decimal('0.0001'),
        feeCurrency: 'btc',
        toAddress: 'xxxxx',
        label: 'My Wallet',
        txid: 'xxxxx',
        createdAt: new Date(1644572610000),
        state: 'done',
        transactionType: 'external',
      };

      mockRestHandler.get.mockResolvedValue(mockWithdrawal);

      const result = await maxSDK.getWithdrawal(params);

      expect(result).toEqual(mockWithdrawal);
      expect(result).toMatchObject({
        uuid: expect.any(String),
        currency: expect.any(String),
        networkProtocol: expect.any(String),
        amount: expect.any(Decimal),
        fee: expect.any(Decimal),
        feeCurrency: expect.any(String),
        toAddress: expect.any(String),
        label: expect.any(String),
        txid: expect.any(String),
        createdAt: expect.any(Date),
        state: expect.any(String),
        transactionType: expect.any(String),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { uuid: 123 };

      await expect(maxSDK.getWithdrawal(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        uuid: 'xxxxx',
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getWithdrawal(params)).rejects.toThrow('Network Error');
    });
  });

  describe('submitWithdrawal', () => {
    it('should submit withdrawal and return correct structure', async () => {
      const params = {
        withdrawAddressUuid: 'xxxxx',
        amount: '0.1',
      };

      const mockWithdrawal: Withdrawal = {
        uuid: 'xxxxx',
        currency: 'btc',
        networkProtocol: 'bitcoin',
        amount: new Decimal('0.1'),
        fee: new Decimal('0.0001'),
        feeCurrency: 'btc',
        toAddress: 'xxxxx',
        label: 'My Wallet',
        txid: null,
        createdAt: new Date(1644572610000),
        state: 'processing',
        transactionType: 'external',
      };

      mockRestHandler.post.mockResolvedValue(mockWithdrawal);

      const result = await maxSDK.submitWithdrawal(params);

      expect(result).toEqual(mockWithdrawal);
      expect(result).toMatchObject({
        uuid: expect.any(String),
        currency: expect.any(String),
        networkProtocol: expect.any(String),
        amount: expect.any(Decimal),
        fee: expect.any(Decimal),
        feeCurrency: expect.any(String),
        toAddress: expect.any(String),
        label: expect.any(String),
        createdAt: expect.any(Date),
        state: expect.any(String),
        transactionType: expect.any(String),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { withdrawAddressUuid: 'xxxxx', amount: 0.1 };

      await expect(maxSDK.submitWithdrawal(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        withdrawAddressUuid: 'xxxxx',
        amount: '0.1',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.submitWithdrawal(params)).rejects.toThrow('Network Error');
    });
  });
});

describe('MaxSDK Trade Methods - Part 2', () => {
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

  describe('submitTWDWithdrawal', () => {
    it('should submit TWD withdrawal and return correct structure', async () => {
      const params = {
        amount: '1000',
      };

      const mockWithdrawal: Withdrawal = {
        uuid: 'xxxxx',
        currency: 'twd',
        networkProtocol: 'fiat',
        amount: new Decimal('1000'),
        fee: new Decimal('15'),
        feeCurrency: 'twd',
        toAddress: 'xxxxx',
        label: 'My Bank Account',
        txid: null,
        createdAt: new Date(1644572610000),
        state: 'processing',
        transactionType: 'external',
      };

      mockRestHandler.post.mockResolvedValue(mockWithdrawal);

      const result = await maxSDK.submitTWDWithdrawal(params);

      expect(result).toEqual(mockWithdrawal);
      expect(result).toMatchObject({
        uuid: expect.any(String),
        currency: 'twd',
        networkProtocol: 'fiat',
        amount: expect.any(Decimal),
        fee: expect.any(Decimal),
        feeCurrency: 'twd',
        toAddress: expect.any(String),
        label: expect.any(String),
        createdAt: expect.any(Date),
        state: expect.any(String),
        transactionType: 'external',
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { amount: 1000 };

      await expect(maxSDK.submitTWDWithdrawal(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        amount: '1000',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.submitTWDWithdrawal(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getWithdrawals', () => {
    it('should return withdrawals with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockWithdrawals: any = await import('../../tests/fixtures/withdrawls.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockResolvedValue(mockWithdrawals);

      const result = await maxSDK.getWithdrawals(params);

      expect(result).toEqual(mockWithdrawals.map(convertToWithdrawal));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((withdrawal) => {
        expect(withdrawal).toMatchObject({
          uuid: expect.any(String),
          currency: expect.any(String),
          networkProtocol: expect.any(String),
          amount: expect.any(Decimal),
          fee: expect.any(Decimal),
          feeCurrency: expect.any(String),
          toAddress: expect.any(String),
          label: expect.any(String),
          createdAt: expect.any(Date),
          state: expect.any(String),
          transactionType: expect.any(String),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getWithdrawals(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getWithdrawals(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getDeposit', () => {
    it('should return deposit details with correct structure', async () => {
      const params = {
        txid: 'xxxxx',
      };

      const mockDeposit: Deposit = {
        uuid: 'xxxxx',
        currency: 'btc',
        networkProtocol: 'bitcoin',
        amount: new Decimal('0.1'),
        toAddress: 'xxxxx',
        txid: 'xxxxx',
        createdAt: new Date(1644572610000),
        confirmations: 6,
        state: 'done',
        stateReason: '',
      };

      mockRestHandler.get.mockResolvedValue(mockDeposit);

      const result = await maxSDK.getDeposit(params);

      // expect(result).toEqual(mockDeposit);
      expect(result).toMatchObject({
        uuid: expect.any(String),
        currency: expect.any(String),
        networkProtocol: expect.any(String),
        amount: expect.any(Decimal),
        toAddress: expect.any(String),
        txid: expect.any(String),
        createdAt: expect.any(Date),
        confirmations: expect.any(Number),
        state: expect.any(String),
        stateReason: expect.any(String),
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { txid: 123 };

      await expect(maxSDK.getDeposit(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        txid: 'xxxxx',
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getDeposit(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getDeposits', () => {
    it('should return deposits with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockDeposits: Deposit[] = await import('../../tests/fixtures/deposits.json').then((result) =>
        (camelCase(result.default, Infinity) as any).map(convertToDeposit)
      );

      mockRestHandler.get.mockResolvedValue(mockDeposits);

      const result = await maxSDK.getDeposits(params);

      expect(result).toEqual(mockDeposits);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((deposit) => {
        expect(deposit).toMatchObject({
          uuid: expect.any(String),
          currency: expect.any(String),
          networkProtocol: expect.any(String),
          amount: expect.any(Decimal),
          toAddress: expect.any(String),
          txid: expect.any(String),
          createdAt: expect.any(Date),
          confirmations: expect.any(Number),
          state: expect.any(String),
          stateReason: expect.any(String),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getDeposits(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getDeposits(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getInternalTransfers', () => {
    it('should return internal transfers with correct structure', async () => {
      const params: GetInternalTransfersParams = {
        side: 'in',
        currency: 'btc',
        limit: 10,
      };

      const mockTransfers: any = await import('../../tests/fixtures/internalTransfers.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockResolvedValue(mockTransfers);

      const result = await maxSDK.getInternalTransfers(params);

      expect(result).toEqual(mockTransfers.map(convertToInternalTransfer));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((transfer) => {
        expect(transfer).toMatchObject({
          uuid: expect.any(String),
          currency: expect.any(String),
          amount: expect.any(Decimal),
          createdAt: expect.any(Date),
          from: expect.any(String),
          to: expect.any(String),
          state: expect.any(String),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { side: 'invalid', currency: 'btc', limit: 10 };

      await expect(maxSDK.getInternalTransfers(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: GetInternalTransfersParams = {
        side: 'in',
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getInternalTransfers(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getRewards', () => {
    it('should return rewards with correct structure', async () => {
      const params: GetRewardsParams = {
        rewardType: 'yield',
        currency: 'btc',
        limit: 10,
      };

      const mockRewards: Reward[] = [
        {
          uuid: 'xxxxx',
          currency: 'btc',
          amount: new Decimal('0.001'),
          createdAt: new Date(1644572610000),
          type: 'staking_reward',
          note: 'Staking Reward for BTC',
        },
      ];

      mockRestHandler.get.mockResolvedValue(mockRewards);

      const result = await maxSDK.getRewards(params);

      expect(result).toEqual(mockRewards);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((reward) => {
        expect(reward).toMatchObject({
          uuid: expect.any(String),
          currency: expect.any(String),
          amount: expect.any(Decimal),
          createdAt: expect.any(Date),
          type: expect.any(String),
          note: expect.any(String),
        });
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = {
        rewardType: 'invalid',
        currency: 'btc',
        limit: 10,
      };

      await expect(maxSDK.getRewards(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params: GetRewardsParams = {
        rewardType: 'staking_reward',
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getRewards(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getDepositAddress', () => {
    it('should return deposit address with correct structure', async () => {
      const params = {
        currency_version: 'btc' as const
      };
  
      const mockDepositAddress: any = await import('../../tests/fixtures/depositAddress.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      const mockCurrencies: any = await import('../../tests/fixtures/currencies.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockImplementation((url: string) => {
        if (url.includes('/currencies')) {
          return Promise.resolve(mockCurrencies);
        } else {
          return Promise.resolve(mockDepositAddress);
        }
      });

      const result = await maxSDK.getDepositAddress(params);
  
      expect(result).toEqual(mockDepositAddress);
      expect(result).toMatchObject({
        currency: expect.any(String),
        networkProtocol: expect.any(String),
        currencyVersion: expect.any(String),
        address: expect.any(String)
      });
    });
  
    it('should handle null address when not yet generated', async () => {
      const params = {
        currency_version: 'btc' as const
      };
  
      const mockDepositAddress = {
        currency: 'btc',
        networkProtocol: 'bitcoin',
        currencyVersion: 'btc',
        address: null
      };
  
      const mockCurrencies: any = await import('../../tests/fixtures/currencies.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockImplementation((url: string) => {
        if (url.includes('/currencies')) {
          return Promise.resolve(mockCurrencies);
        } else {
          return Promise.resolve(mockDepositAddress);
        }
      });
  
      const result = await maxSDK.getDepositAddress(params);
  
      expect(result).toEqual(mockDepositAddress);
      expect(result.address).toBeNull();
    });
  });
});

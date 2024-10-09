import { camelCase } from 'change-case/keys';
import { Decimal } from 'decimal.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZodError } from 'zod';


import { MAXOptions } from '../types.js';

import {
  convertToAccount,
  convertToAdRatio,
  convertToDebt,
  convertToFundSource,
  convertToInterest,
  convertToManualRepayment,
} from './converter.js';
import RestHandler from './rest.js';
import type { Debt, ManualRepayment } from './types.js';

import MaxSDK from './index.js';

vi.mock('./rest');

describe('MaxSDK Wallet Methods', () => {
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

  describe('getAccounts', () => {
    it('should return accounts with correct structure', async () => {
      const params = { currency: 'btc' };
      const mockAccounts: any = await import('../../tests/fixtures/spotAccounts.json').then((result) =>
        camelCase(result.default, Infinity)
      );
      mockRestHandler.get.mockResolvedValue(mockAccounts);

      const result = await maxSDK.getAccounts('spot', params);

      expect(result).toEqual(mockAccounts.map(convertToAccount));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((account) => {
        expect(account).toHaveProperty('currency');
        expect(account).toHaveProperty('balance');
        expect(account).toHaveProperty('locked');
        expect(account).toHaveProperty('staked');
        expect(typeof account.currency).toBe('string');
        // expect(typeof account.balance).toBe('string');
        expect(account.balance instanceof Decimal).toBe(true);
        // expect(typeof account.locked).toBe('string');
        expect(account.locked instanceof Decimal).toBe(true);
        if (account.staked === null) {
          expect(account.staked).toBe(null);
        } else {
          // expect(account.staked).toBeTypeOf('string');
          expect(account.staked instanceof Decimal).toBe(true);
        }
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 123 };

      await expect(maxSDK.getAccounts('spot', invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = { currency: 'btc' };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getAccounts('spot', params)).rejects.toThrow('Network Error');
    });
  });

  describe('getAdRatio', () => {
    it('should return AD ratio with correct structure', async () => {
      const mockAdRatio: any = await import('../../tests/fixtures/adRatio.json').then((result) => camelCase(result.default, Infinity));

      mockRestHandler.get.mockResolvedValue(mockAdRatio);

      const result = await maxSDK.getAdRatio();

      expect(result).toEqual(convertToAdRatio(mockAdRatio));
      expect(result).toHaveProperty('adRatio');
      expect(result).toHaveProperty('assetInUsdt');
      expect(result).toHaveProperty('debtInUsdt');
      expect(result.adRatio instanceof Decimal).toBe(true);
      expect(result.assetInUsdt instanceof Decimal).toBe(true);
      expect(result.debtInUsdt instanceof Decimal).toBe(true);
      // expect(typeof result.adRatio).toBe('string');
      // expect(typeof result.assetInUsdt).toBe('string');
      // expect(typeof result.debtInUsdt).toBe('string');
    });

    it('should handle network errors', async () => {
      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getAdRatio()).rejects.toThrow('Network Error');
    });
  });

  describe('submitLoan', () => {
    it('should submit a loan and return debt details', async () => {
      const params = {
        currency: 'btc',
        amount: '0.1',
      };

      const mockDebt: Debt = {
        sn: 'xxxxx',
        currency: 'btc',
        amount: new Decimal('0.1'),
        state: 'confirmed',
        createdAt: new Date(1644572610000),
        interestRate: new Decimal('0.0001'),
      };

      mockRestHandler.post.mockResolvedValue(mockDebt);

      const result = await maxSDK.submitLoan(params);

      expect(result).toEqual(mockDebt);
      expect(result).toHaveProperty('sn');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('interestRate');
      expect(typeof result.sn).toBe('string');
      expect(typeof result.currency).toBe('string');
      expect(result.amount instanceof Decimal).toBe(true);

      // expect(typeof result.amount).toBe('string');
      expect(typeof result.state).toBe('string');
      // expect(typeof result.createdAt).toBe('number');
      expect(result.createdAt instanceof Date).toBe(true);
      // expect(typeof result.interestRate).toBe('string');
      expect(result.interestRate instanceof Decimal).toBe(true);
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', amount: 0.1 };

      await expect(maxSDK.submitLoan(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        amount: '0.1',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.submitLoan(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getLoans', () => {
    it('should return loans with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockLoans: any = await import('../../tests/fixtures/loans.json').then((result) => camelCase(result.default, Infinity));
      mockRestHandler.get.mockResolvedValue(mockLoans);

      const result = await maxSDK.getLoans(params);

      expect(result).toEqual(mockLoans.map(convertToDebt));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((loan) => {
        expect(loan).toHaveProperty('sn');
        expect(loan).toHaveProperty('currency');
        expect(loan).toHaveProperty('amount');
        expect(loan).toHaveProperty('state');
        expect(loan).toHaveProperty('createdAt');
        expect(loan).toHaveProperty('interestRate');
        expect(typeof loan.sn).toBe('string');
        expect(typeof loan.currency).toBe('string');
        expect(loan.amount instanceof Decimal).toBe(true);
        // expect(typeof loan.amount).toBe('string');
        expect(typeof loan.state).toBe('string');
        expect(loan.createdAt instanceof Date).toBe(true);
        // expect(typeof loan.createdAt).toBe('number');
        expect(loan.interestRate instanceof Decimal).toBe(true);
        // expect(typeof loan.interestRate).toBe('string');
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getLoans(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getLoans(params)).rejects.toThrow('Network Error');
    });
  });

  describe('submitRepayment', () => {
    it('should submit a repayment and return repayment details', async () => {
      const params = {
        currency: 'btc',
        amount: '0.05',
      };

      const mockRepayment: ManualRepayment = {
        currency: 'btc',
        amount: new Decimal('0.05'),
        principal: new Decimal('0.04'),
        interest: new Decimal('0.01'),
        state: 'confirmed',
        sn: 'xxxxx',
        createdAt: new Date(1644572610000),
      };

      mockRestHandler.post.mockResolvedValue(mockRepayment);

      const result = await maxSDK.submitRepayment(params);

      expect(result).toEqual(mockRepayment);
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('principal');
      expect(result).toHaveProperty('interest');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('sn');
      expect(result).toHaveProperty('createdAt');

      expect(result.amount instanceof Decimal).toBe(true);
      expect(result.principal instanceof Decimal).toBe(true);
      expect(result.interest instanceof Decimal).toBe(true);
      expect(result.createdAt instanceof Date).toBe(true);

      expect(typeof result.currency).toBe('string');
      expect(typeof result.state).toBe('string');
      expect(typeof result.sn).toBe('string');
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', amount: 0.05 };

      await expect(maxSDK.submitRepayment(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        amount: '0.05',
      };

      mockRestHandler.post.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.submitRepayment(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getRepayments', () => {
    it('should return repayments with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockRepayments: any = await import('../../tests/fixtures/repayments.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockResolvedValue(mockRepayments);

      const result = await maxSDK.getRepayments(params);

      expect(result).toEqual(mockRepayments.map(convertToManualRepayment));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((repayment) => {
        expect(repayment).toHaveProperty('currency');
        expect(repayment).toHaveProperty('amount');
        expect(repayment).toHaveProperty('principal');
        expect(repayment).toHaveProperty('interest');
        expect(repayment).toHaveProperty('state');
        expect(repayment).toHaveProperty('sn');
        expect(repayment).toHaveProperty('createdAt');

        expect(repayment.amount instanceof Decimal).toBe(true);
        expect(repayment.principal instanceof Decimal).toBe(true);
        expect(repayment.interest instanceof Decimal).toBe(true);
        expect(repayment.createdAt instanceof Date).toBe(true);

        expect(typeof repayment.currency).toBe('string');
        expect(typeof repayment.state).toBe('string');
        expect(typeof repayment.sn).toBe('string');
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getRepayments(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getRepayments(params)).rejects.toThrow('Network Error');
    });
  });

  // describe('getLiquidations', () => {
  //   it('should return liquidations with correct structure', async () => {
  //     const params = {
  //       limit: 10,
  //     };

  //     const mockLiquidations: Liquidation[] = [
  //       {
  //         sn: 'xxxxx',
  //         adRatio: '1.2',
  //         expectedAdRatio: '1.5',
  //         createdAt: 1644572610000,
  //         state: 'liquidated',
  //       },
  //     ];

  //     mockRestHandler.get.mockResolvedValue(mockLiquidations);

  //     const result = await maxSDK.getLiquidations(params);

  //     expect(result).toEqual(mockLiquidations);
  //     expect(Array.isArray(result)).toBe(true);
  //     result.forEach(liquidation => {
  //       expect(liquidation).toHaveProperty('sn');
  //       expect(liquidation).toHaveProperty('adRatio');
  //       expect(liquidation).toHaveProperty('expectedAdRatio');
  //       expect(liquidation).toHaveProperty('createdAt');
  //       expect(liquidation).toHaveProperty('state');
  //       expect(typeof liquidation.sn).toBe('string');
  //       expect(typeof liquidation.adRatio).toBe('string');
  //       expect(typeof liquidation.expectedAdRatio).toBe('string');
  //       expect(typeof liquidation.createdAt).toBe('number');
  //       expect(typeof liquidation.state).toBe('string');
  //     });
  //   });

  //   it('should throw ZodError for invalid input', async () => {
  //     const invalidParams = { limit: 'invalid' };

  //     await expect(maxSDK.getLiquidations(invalidParams as any)).rejects.toThrow(ZodError);
  //   });

  //   it('should handle network errors', async () => {
  //     const params = {
  //       limit: 10,
  //     };

  //     mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

  //     await expect(maxSDK.getLiquidations(params)).rejects.toThrow('Network Error');
  //   });
  // });

  // describe('getLiquidationDetail', () => {
  //   it('should return liquidation detail with correct structure', async () => {
  //     const params = {
  //       sn: 'xxxxx',
  //     };

  //     const mockLiquidationDetail: LiquidationDetail = {
  //       sn: 'xxxxx',
  //       adRatio: '1.2',
  //       expectedAdRatio: '1.5',
  //       createdAt: 1644572610000,
  //       state: 'liquidated',
  //       repayments: [
  //         {
  //           currency: 'btc',
  //           amount: '0.05',
  //           principal: '0.04',
  //           interest: '0.01',
  //           state: 'confirmed',
  //         },
  //       ],
  //       liquidations: [
  //         {
  //           market: 'btcusdt',
  //           type: 'sell',
  //           price: '40000',
  //           volume: '0.1',
  //           fee: '0.0001',
  //           feeCurrency: 'btc',
  //           repayment: {
  //             currency: 'btc',
  //             amount: '0.05',
  //             principal: '0.04',
  //             interest: '0.01',
  //             state: 'confirmed',
  //           },
  //         },
  //       ],
  //     };

  //     mockRestHandler.get.mockResolvedValue(mockLiquidationDetail);

  //     const result = await maxSDK.getLiquidationDetail(params);

  //     expect(result).toEqual(mockLiquidationDetail);
  //     expect(result).toHaveProperty('sn');
  //     expect(result).toHaveProperty('adRatio');
  //     expect(result).toHaveProperty('expectedAdRatio');
  //     expect(result).toHaveProperty('createdAt');
  //     expect(result).toHaveProperty('state');
  //     expect(result).toHaveProperty('repayments');
  //     expect(result).toHaveProperty('liquidations');
  //     expect(Array.isArray(result.repayments)).toBe(true);
  //     expect(Array.isArray(result.liquidations)).toBe(true);
  //   });

  //   it('should throw ZodError for invalid input', async () => {
  //     const invalidParams = { sn: 123 };

  //     await expect(maxSDK.getLiquidationDetail(invalidParams as any)).rejects.toThrow(ZodError);
  //   });

  //   it('should handle network errors', async () => {
  //     const params = {
  //       sn: 'xxxxx',
  //     };

  //     mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

  //     await expect(maxSDK.getLiquidationDetail(params)).rejects.toThrow('Network Error');
  //   });
  // });

  describe('getInterests', () => {
    it('should return interests with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockInterests: any = await import('../../tests/fixtures/interests.json').then((result) => camelCase(result.default, Infinity));

      mockRestHandler.get.mockResolvedValue(mockInterests);

      const result = await maxSDK.getInterests(params);

      expect(result).toEqual(mockInterests.map(convertToInterest));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((interest) => {
        expect(interest).toHaveProperty('currency');
        expect(interest).toHaveProperty('amount');
        expect(interest).toHaveProperty('interestRate');
        expect(interest).toHaveProperty('principal');
        expect(interest).toHaveProperty('createdAt');
        expect(typeof interest.currency).toBe('string');
        expect(interest.amount instanceof Decimal).toBe(true);
        expect(interest.interestRate instanceof Decimal).toBe(true);
        expect(interest.principal instanceof Decimal).toBe(true);
        expect(interest.createdAt instanceof Date).toBe(true);
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getInterests(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getInterests(params)).rejects.toThrow('Network Error');
    });
  });

  describe('getWithdrawAddresses', () => {
    it('should return withdraw addresses with correct structure', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      const mockWithdrawAddresses: any = await import('../../tests/fixtures/withdrawAddress.json').then((result) =>
        camelCase(result.default, Infinity)
      );

      mockRestHandler.get.mockResolvedValue(mockWithdrawAddresses);

      const result = await maxSDK.getWithdrawAddresses(params);

      expect(result).toEqual(mockWithdrawAddresses.map(convertToFundSource));
      expect(Array.isArray(result)).toBe(true);
      result.forEach((address) => {
        expect(address).toHaveProperty('uuid');
        expect(address).toHaveProperty('currency');
        expect(address).toHaveProperty('networkProtocol');
        expect(address).toHaveProperty('address');
        expect(address).toHaveProperty('extraLabel');
        expect(address).toHaveProperty('createdAt');
        expect(address).toHaveProperty('isInternal');
        expect(typeof address.uuid).toBe('string');
        expect(typeof address.currency).toBe('string');
        if (address.networkProtocol === null) {
          expect(address.networkProtocol).toBe(null);
        } else {
          expect(address.networkProtocol).toBeTypeOf('string');
        }
        expect(typeof address.address).toBe('string');
        expect(typeof address.extraLabel).toBe('string');
        expect(address.createdAt instanceof Date).toBe(true);
        expect(typeof address.isInternal).toBe('boolean');
      });
    });

    it('should throw ZodError for invalid input', async () => {
      const invalidParams = { currency: 'btc', limit: 'invalid' };

      await expect(maxSDK.getWithdrawAddresses(invalidParams as any)).rejects.toThrow(ZodError);
    });

    it('should handle network errors', async () => {
      const params = {
        currency: 'btc',
        limit: 10,
      };

      mockRestHandler.get.mockRejectedValue(new Error('Network Error'));

      await expect(maxSDK.getWithdrawAddresses(params)).rejects.toThrow('Network Error');
    });
  });
});

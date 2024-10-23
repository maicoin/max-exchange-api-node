import { Decimal } from 'decimal.js';

import { BASE_URL } from '../config.js';
import { MAXOptions } from '../types.js';

import {
  convertToAdRatio,
  convertToBorrowingLimits,
  convertToBorrowingTransfer,
  convertToCurrency,
  convertToDebt,
  convertToDeposit,
  convertToDepth,
  convertToFundSource,
  convertToIndexPrice,
  convertToIndexPrices,
  convertToInterest,
  convertToInterestRate,
  convertToInternalTransfer,
  convertToKLine,
  convertToLiquidation,
  convertToLiquidationDetail,
  convertToManualRepayment,
  convertToMarket,
  convertToOrder,
  convertToPublicTrade,
  convertToReward,
  convertToTicker,
  convertToTrade,
  convertToUserInfo,
  convertToWithdrawal,
} from './converter.js';
import RestHandler from './rest.js';
import {
  CancelOrderParamsSchema,
  type CancelOrderParams,
  GetDepositParamsSchema,
  type GetDepositParams,
  GetDepositsParamsSchema,
  type GetDepositsParams,
  GetDepthParamsSchema,
  type GetDepthParams,
  GetInterestsParamsSchema,
  type GetInterestsParams,
  GetInternalTransfersParamsSchema,
  type GetInternalTransfersParams,
  GetKLineParamsSchema,
  type GetKLineParams,
  GetLiquidationDetailParamsSchema,
  type GetLiquidationDetailParams,
  GetLiquidationsParamsSchema,
  type GetLiquidationsParams,
  GetLoansParamsSchema,
  type GetLoansParams,
  GetOrderParamsSchema,
  type GetOrderParams,
  GetOrderTradesParamsSchema,
  type GetOrderTradesParams,
  GetPublicTradesParamsSchema,
  type GetPublicTradesParams,
  GetRepaymentsParamsSchema,
  type GetRepaymentsParams,
  GetRewardsParamsSchema,
  type GetRewardsParams,
  GetTickerParamsSchema,
  type GetTickerParams,
  GetTickersParamsSchema,
  type GetTickersParams,
  GetTransfersParamsSchema,
  type GetTransfersParams,
  GetWithdrawAddressesParamsSchema,
  type GetWithdrawAddressesParams,
  GetWithdrawalParamsSchema,
  type GetWithdrawalParams,
  GetWithdrawalsParamsSchema,
  type GetWithdrawalsParams,
  HistoricalIndexPricesParamsSchema,
  type HistoricalIndexPricesParams,
  SubmitLoanParamsSchema,
  type SubmitLoanParams,
  SubmitRepaymentParamsSchema,
  type SubmitRepaymentParams,
  SubmitTWDWithdrawalParamsSchema,
  type SubmitTWDWithdrawalParams,
  SubmitWithdrawalParamsSchema,
  type SubmitWithdrawalParams,
  TransferBetweenWalletsParamsSchema,
  type TransferBetweenWalletsParams,
} from './schema.js';
import type {
  AdRatio,
  BorrowingLimits,
  BorrowingInterestRates,
  BorrowingTransfer,
  Currency,
  Debt,
  Deposit,
  FundSource,
  IndexPrice,
  Interest,
  InternalTransfer,
  Liquidation,
  LiquidationDetail,
  ManualRepayment,
  Market,
  Order,
  PublicTrade,
  Reward,
  Ticker,
  Timestamp,
  Trade,
  UserInfo,
  Withdrawal,
  Depth,
  IndexPrices,
} from './types.js';
import Wallet from './wallet.js';

/**
 * MaxSDK class for interacting with the MAX API.
 */
class MaxSDK {
  #restHandler: RestHandler;
  mWallet: Wallet;
  spotWallet: Wallet;

  /**
   * Creates an instance of MaxSDK.
   * @param {MAXOptions} options - options for the Rest API.
   * @param {string} [url=BASE_URL] - The base URL for the API.
   */
  constructor(options: MAXOptions, url: string = BASE_URL) {
    this.#restHandler = new RestHandler(url, '/api/v3', options.accessKey, options.secretKey);
    this.mWallet = new Wallet(this.#restHandler, 'm');
    this.spotWallet = new Wallet(this.#restHandler, 'spot');
  }

  /**
   * Get user information.
   * @returns {Promise<UserInfo>} A promise that resolves to a UserInfo object.
   */
  async getUserInfo(): Promise<UserInfo> {
    const response = await this.#restHandler.get<any>('/info');
    return convertToUserInfo(response);
  }

  /* PUBLIC REGION */
  /**
   * Get latest index prices of m-wallet.
   * @returns {Promise<IndexPrices>} A promise that resolves to IndexPrices objects.
   */
  async getIndexPrices(): Promise<IndexPrices> {
    const response = await this.#restHandler.get<Record<string, string>>('/wallet/m/index_prices');
    // return response.map(this.convertToIndexPrice);
    return convertToIndexPrices(response);
  }

  /**
   * Get latest historical index prices.
   * @param {HistoricalIndexPricesParams} params - The parameters for fetching historical index prices.
   * @returns {Promise<IndexPrice[]>} A promise that resolves to an array of IndexPrice objects.
   */
  async getHistoricalIndexPrices(params: HistoricalIndexPricesParams): Promise<IndexPrice[]> {
    const validatedParams = HistoricalIndexPricesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/historical_index_prices', validatedParams);
    return response.map(convertToIndexPrice);
  }

  /**
   * Get total available loan amount.
   * @returns {Promise<BorrowingLimits>} A promise that resolves to the available loan amount.
   */
  async getLimits(): Promise<BorrowingLimits> {
    const response = await this.#restHandler.get<Record<string, string>>('/wallet/m/limits');
    return convertToBorrowingLimits(response);
  }

  /**
   * Get latest interest rates of m-wallet.
   * @returns {Promise<BorrowingInterestRates>} A promise that resolves to the latest interest rates.
   */
  async getInterestRates(): Promise<BorrowingInterestRates> {
    const response =
      await this.#restHandler.get<Record<string, { hourlyInterestRate: string; nextHourlyInterestRate: string }>>(
        '/wallet/m/interest_rates'
      );
    return convertToInterestRate(response);
  }

  /**
   * Get all available markets.
   * @returns {Promise<Market[]>} A promise that resolves to an array of Market objects.
   */
  async getMarkets(): Promise<Market[]> {
    const response = await this.#restHandler.get<any[]>('/markets');
    return response.map(convertToMarket);
  }

  /**
   * Get all available currencies.
   * @returns {Promise<Currency[]>} A promise that resolves to an array of Currency objects.
   */
  async getCurrencies(): Promise<Currency[]> {
    const response = await this.#restHandler.get<any[]>('/currencies');
    return response.map(convertToCurrency);
  }

  /**
   * Get server current time, in seconds since Unix epoch.
   * @returns {Promise<Timestamp>} A promise that resolves to a Timestamp object.
   */
  async getTimestamp(): Promise<Timestamp> {
    const response = await this.#restHandler.get<{ timestamp: number }>('/timestamp');
    return { timestamp: new Date(response.timestamp * 1000) };
  }

  /**
   * Get OHLC(k line) of a specific market.
   * @param {GetKLineParams} params - The parameters for fetching K-line data.
   * @returns {Promise<[Date, Decimal, Decimal, Decimal, Decimal, Decimal][]>} A promise that resolves to an array of K-line data.
   */
  async getKLine(params: GetKLineParams): Promise<[Date, Decimal, Decimal, Decimal, Decimal, Decimal][]> {
    const validatedParams = GetKLineParamsSchema.parse(params);
    const response = await this.#restHandler.get<[number, string, string, string, string, string][]>('/k', validatedParams);
    return convertToKLine(response);
  }

  /**
   * Get depth of a specified market.
   * @param {GetDepthParams} params - The parameters for fetching market depth.
   * @returns {Promise<Depth>} A promise that resolves to an object containing ask and bid orders, and timestamp.
   */
  async getDepth(params: GetDepthParams): Promise<Depth> {
    const validatedParams = GetDepthParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/depth', validatedParams);
    return convertToDepth(response);
  }

  /**
   * Get recent trades on market, sorted in reverse creation order.
   * @param {GetPublicTradesParams} params - The parameters for fetching public trades.
   * @returns {Promise<PublicTrade[]>} A promise that resolves to an array of PublicTrade objects.
   */
  async getPublicTrades(params: GetPublicTradesParams): Promise<PublicTrade[]> {
    const validatedParams = GetPublicTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/trades', validatedParams);
    return response.map(convertToPublicTrade);
  }

  /**
   * Get ticker of all markets.
   * @param {GetTickersParams} params - The parameters for fetching tickers.
   * @returns {Promise<Ticker[]>} A promise that resolves to an array of Ticker objects.
   */
  async getTickers(params: GetTickersParams): Promise<Ticker[]> {
    const validatedParams = GetTickersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/tickers', validatedParams);
    return response.map(convertToTicker);
  }

  /**
   * Get ticker of specific market.
   * @param {GetTickerParams} params - The parameters for fetching a specific ticker.
   * @returns {Promise<Ticker>} A promise that resolves to a Ticker object.
   */
  async getTicker(params: GetTickerParams): Promise<Ticker> {
    const validatedParams = GetTickerParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/ticker', validatedParams);
    return convertToTicker(response);
  }

  /* WALLET REGION */

  /**
   * Get the latest AD ratio of your m-wallet.
   * @returns {Promise<AdRatio>} A promise that resolves to an AdRatio object.
   */
  async getAdRatio(): Promise<AdRatio> {
    const response = await this.#restHandler.get<any>('/wallet/m/ad_ratio');
    return convertToAdRatio(response);
  }

  /**
   * Create a loan request for your m-wallet.
   * @param {SubmitLoanParams} params - The parameters for submitting a loan.
   * @returns {Promise<Debt>} A promise that resolves to a Debt object.
   */
  async submitLoan(params: SubmitLoanParams): Promise<Debt> {
    const validatedParams = SubmitLoanParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/loan', validatedParams);
    return convertToDebt(response);
  }

  /**
   * Get loan history of your m-wallet.
   * @param {GetLoansParams} params - The parameters for fetching loan history.
   * @returns {Promise<Debt[]>} A promise that resolves to an array of Debt objects.
   */
  async getLoans(params: GetLoansParams): Promise<Debt[]> {
    const validatedParams = GetLoansParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/loans', validatedParams);
    return response.map(convertToDebt);
  }

  /**
   * Make a repayment for your loan.
   * @param {SubmitRepaymentParams} params - The parameters for submitting a repayment.
   * @returns {Promise<ManualRepayment>} A promise that resolves to a ManualRepayment object.
   */
  async submitRepayment(params: SubmitRepaymentParams): Promise<ManualRepayment> {
    const validatedParams = SubmitRepaymentParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/repayment', validatedParams);
    return convertToManualRepayment(response);
  }

  /**
   * Get repayment history of your m-wallet.
   * @param {GetRepaymentsParams} params - The parameters for fetching repayment history.
   * @returns {Promise<ManualRepayment[]>} A promise that resolves to an array of ManualRepayment objects.
   */
  async getRepayments(params: GetRepaymentsParams): Promise<ManualRepayment[]> {
    const validatedParams = GetRepaymentsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/repayments', validatedParams);
    return response.map(convertToManualRepayment);
  }

  /**
   * Get liquidation history of your m-wallet.
   * @param {GetLiquidationsParams} params - The parameters for fetching liquidation history.
   * @returns {Promise<Liquidation[]>} A promise that resolves to an array of Liquidation objects.
   */
  async getLiquidations(params: GetLiquidationsParams): Promise<Liquidation[]> {
    const validatedParams = GetLiquidationsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/liquidations', validatedParams);
    return response.map(convertToLiquidation);
  }

  /**
   * Get detail of one specific liquidation history of your m-wallet.
   * @param {GetLiquidationDetailParams} params - The parameters for fetching liquidation detail.
   * @returns {Promise<LiquidationDetail>} A promise that resolves to a LiquidationDetail object.
   */
  async getLiquidationDetail(params: GetLiquidationDetailParams): Promise<LiquidationDetail> {
    const validatedParams = GetLiquidationDetailParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/wallet/m/liquidation', validatedParams);
    return convertToLiquidationDetail(response);
  }

  /**
   * Get interest history of your m-wallet.
   * @param {GetInterestsParams} params - The parameters for fetching interest history.
   * @returns {Promise<Interest[]>} A promise that resolves to an array of Interest objects.
   */
  async getInterests(params: GetInterestsParams): Promise<Interest[]> {
    const validatedParams = GetInterestsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/interests', validatedParams);
    return response.map(convertToInterest);
  }

  /**
   * Get withdraw addresses of spot wallet.
   * @param {GetWithdrawAddressesParams} params - The parameters for fetching withdraw addresses.
   * @returns {Promise<FundSource[]>} A promise that resolves to an array of FundSource objects.
   */
  async getWithdrawAddresses(params: GetWithdrawAddressesParams): Promise<FundSource[]> {
    const validatedParams = GetWithdrawAddressesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/withdraw_addresses', validatedParams);
    return response.map(convertToFundSource);
  }

  /* ORDER REGION */

  /**
   * Get order detail.
   * @param {GetOrderParams} params - The parameters for fetching order details.
   * @returns {Promise<Order>} A promise that resolves to an Order object.
   */
  async getOrder(params: GetOrderParams): Promise<Order> {
    const validatedParams = GetOrderParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/order', validatedParams);
    return convertToOrder(response);
  }

  /**
   * Cancel an order.
   * @param {CancelOrderParams} params - The parameters for cancelling an order.
   * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
   */
  async cancelOrder(params: CancelOrderParams): Promise<{ success: boolean }> {
    const validatedParams = CancelOrderParamsSchema.parse(params);
    return this.#restHandler.delete<{ success: boolean }>('/order', validatedParams);
  }

  /* TRADE REGION */

  /**
   * Get trade detail by your order info.
   * @param {GetOrderTradesParams} params - The parameters for fetching order trades.
   * @returns {Promise<Trade[]>} A promise that resolves to an array of Trade objects.
   */
  async getOrderTrades(params: GetOrderTradesParams): Promise<Trade[]> {
    const validatedParams = GetOrderTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/order/trades', validatedParams);
    return response.map(convertToTrade);
  }

  /**
   * Create a transaction between your spot wallet and m-wallet.
   * @param {TransferBetweenWalletsParams} params - The parameters for transferring between wallets.
   * @returns {Promise<BorrowingTransfer>} A promise that resolves to a BorrowingTransfer object.
   */
  async transferBetweenWallets(params: TransferBetweenWalletsParams): Promise<BorrowingTransfer> {
    const validatedParams = TransferBetweenWalletsParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/transfer', validatedParams);
    return convertToBorrowingTransfer(response);
  }

  /**
   * List transactions between your spot wallet and m-wallet.
   * @param {GetTransfersParams} params - The parameters for fetching transfers.
   * @returns {Promise<BorrowingTransfer[]>} A promise that resolves to an array of BorrowingTransfer objects.
   */
  async getTransfers(params: GetTransfersParams): Promise<BorrowingTransfer[]> {
    const validatedParams = GetTransfersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/transfers', validatedParams);
    return response.map(convertToBorrowingTransfer);
  }

  /**
   * Get details of a specific external withdraw.
   * @param {GetWithdrawalParams} params - The parameters for fetching withdrawal details.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async getWithdrawal(params: GetWithdrawalParams): Promise<Withdrawal> {
    const validatedParams = GetWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/withdrawal', validatedParams);
    return convertToWithdrawal(response);
  }

  /**
   * Submit a crypto withdrawal. IP whitelist for api token is required.
   * @param {SubmitWithdrawalParams} params - The parameters for submitting a withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitWithdrawal(params: SubmitWithdrawalParams): Promise<Withdrawal> {
    const validatedParams = SubmitWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/withdrawal', validatedParams);
    return convertToWithdrawal(response);
  }

  /**
   * Submit twd withdrawal to verified bank account. IP whitelist for api token is required.
   * @param {z.infer<typeof SubmitTWDWithdrawalParamsSchema>} params - The parameters for submitting a TWD withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitTWDWithdrawal(params: SubmitTWDWithdrawalParams): Promise<Withdrawal> {
    const validatedParams = SubmitTWDWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/withdrawal/twd', validatedParams);
    return convertToWithdrawal(response);
  }

  /**
   * Get external withdrawals history.
   * @param {GetWithdrawalsParams} params - The parameters for fetching withdrawal history.
   * @returns {Promise<Withdrawal[]>} A promise that resolves to an array of Withdrawal objects.
   */
  async getWithdrawals(params: GetWithdrawalsParams): Promise<Withdrawal[]> {
    const validatedParams = GetWithdrawalsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/withdrawals', validatedParams);
    return response.map(convertToWithdrawal);
  }

  /**
   * Get details of a specific deposit.
   * @param {GetDepositParams} params - The parameters for fetching deposit details.
   * @returns {Promise<Deposit>} A promise that resolves to a Deposit object.
   */
  async getDeposit(params: GetDepositParams): Promise<Deposit> {
    const validatedParams = GetDepositParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/deposit', validatedParams);
    return convertToDeposit(response);
  }

  /**
   * Get external deposits history.
   * @param {GetDepositsParams} params - The parameters for fetching deposit history.
   * @returns {Promise<Deposit[]>} A promise that resolves to an array of Deposit objects.
   */
  async getDeposits(params: GetDepositsParams): Promise<Deposit[]> {
    const validatedParams = GetDepositsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/deposits', validatedParams);
    return response.map(convertToDeposit);
  }

  /**
   * Get internal transfers history.
   * @param {GetInternalTransfersParams} params - The parameters for fetching internal transfer history.
   * @returns {Promise<InternalTransfer[]>} A promise that resolves to an array of InternalTransfer objects.
   */
  async getInternalTransfers(params: GetInternalTransfersParams): Promise<InternalTransfer[]> {
    const validatedParams = GetInternalTransfersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/internal_transfers', validatedParams);
    return response.map(convertToInternalTransfer);
  }

  /**
   * Get rewards history.
   * @param {GetRewardsParams} params - The parameters for fetching rewards history.
   * @returns {Promise<Reward[]>} A promise that resolves to an array of Reward objects.
   */
  async getRewards(params: GetRewardsParams): Promise<Reward[]> {
    const validatedParams = GetRewardsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/rewards', validatedParams);
    return response.map(convertToReward);
  }

  /**
   * Calibrate the local time with the server time.
   * This method fetches the server time and compares it with the local time.
   * If the difference is larger than 30 seconds, it adjusts the local time difference.
   * @returns {Promise<string>} A promise that resolves to a string message indicating whether the time was synced or not.
   */
  async calibrateTime(): Promise<string> {
    const data = await this.getTimestamp();
    const systemTime = data.timestamp.getTime();
    const localTime = Date.now();
    const diff = localTime - systemTime;
    if (Math.abs(diff) >= 30 * 1000) {
      this.#restHandler.setDiff(diff);
      return `Local Time synced, diff was ${diff} ms.`;
    }
    return 'Local Time is synced.';
  }
}

export default MaxSDK;

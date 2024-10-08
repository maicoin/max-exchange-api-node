import { Decimal } from 'decimal.js';
import { z } from 'zod';
import RestHandler from './rest.js';
import type {
  Account, AdRatio, BorrowingLimits, BorrowingInterestRates, BorrowingTransfer,
  Currency, Debt, Deposit, FundSource, IndexPrice, Interest, InternalTransfer,
  Liquidation, LiquidationDetail, ManualRepayment, Market, Order, PublicTrade,
  Reward, Ticker, Timestamp, Trade, UserInfo, Withdrawal, Depth, PriceLevel,
  Repayment,
  ForcedLiquidation,
  VipLevel,
  CurrencyNetwork,
  IndexPrices
} from './types.js';
import {
  CancelAllOrdersParamsSchema, CancelOrderParamsSchema, FetchOrdersParamsSchema,
  GetAccountsParamsSchema, GetDepositParamsSchema, GetDepositsParamsSchema,
  GetDepthParamsSchema, GetInterestsParamsSchema, GetInternalTransfersParamsSchema,
  GetKLineParamsSchema, GetLiquidationDetailParamsSchema, GetLiquidationsParamsSchema,
  GetLoansParamsSchema, GetOrderHistoryParamsSchema, GetOrderParamsSchema,
  GetOrderTradesParamsSchema, GetPublicTradesParamsSchema, GetRepaymentsParamsSchema,
  GetRewardsParamsSchema, GetTickerParamsSchema, GetTickersParamsSchema,
  GetTradesParamsSchema, GetTransfersParamsSchema, GetWithdrawAddressesParamsSchema,
  GetWithdrawalParamsSchema, GetWithdrawalsParamsSchema, HistoricalIndexPricesParamsSchema,
  SubmitLoanParamsSchema, SubmitOrderParamsSchema, SubmitRepaymentParamsSchema,
  SubmitTWDWithdrawalParamsSchema, SubmitWithdrawalParamsSchema,
  TransferBetweenWalletsParamsSchema, WalletType, WalletTypeSchema
} from './schema.js';
import { BASE_URL } from '../config.js';
import { MAXOptions } from '../types.js';

/**
 * MaxSDK class for interacting with the MAX API.
 */
class MaxSDK {
  #restHandler: RestHandler;

  /**
   * Creates an instance of MaxSDK.
   * @param {MAXOptions} options - options for the Rest API.
   * @param {string} [url=BASE_URL] - The base URL for the API.
   */
  constructor(options: MAXOptions, url: string = BASE_URL) {
    this.#restHandler = new RestHandler(url, '/api/v3', options.accessKey, options.secretKey);
  }

  /**
   * Get user information.
   * @returns {Promise<UserInfo>} A promise that resolves to a UserInfo object.
   */
  async getUserInfo(): Promise<UserInfo> {
    const response = await this.#restHandler.get<any>('/info');
    return this.#convertToUserInfo(response);
  }

  /* PUBLIC REGION */
  /**
   * Get latest index prices of m-wallet.
   * @returns {Promise<IndexPrices>} A promise that resolves to of IndexPrices objects.
   */
  async getIndexPrices(): Promise<IndexPrices> {
    const response = await this.#restHandler.get<any[]>('/wallet/m/index_prices');
    //return response.map(this.convertToIndexPrice);
    return Object.entries(response).reduce((acc, [key, value]) => {
      acc[key] = new Decimal(value);
      return acc;
    }, {} as IndexPrices);
  }

  /**
   * Get latest historical index prices.
   * @param {z.infer<typeof HistoricalIndexPricesParamsSchema>} params - The parameters for fetching historical index prices.
   * @returns {Promise<IndexPrice[]>} A promise that resolves to an array of IndexPrice objects.
   */
  async getHistoricalIndexPrices(params: z.infer<typeof HistoricalIndexPricesParamsSchema>): Promise<IndexPrice[]> {
    const validatedParams = HistoricalIndexPricesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/historical_index_prices', validatedParams);
    return response.map(this.#convertToIndexPrice);
  }

  /**
   * Get total available loan amount.
   * @returns {Promise<BorrowingLimits>} A promise that resolves to the available loan amount.
   */
  async getLimits(): Promise<BorrowingLimits> {
    const response = await this.#restHandler.get<Record<string, string>>('/wallet/m/limits');
    return Object.entries(response).reduce((acc, [key, value]) => {
      acc[key] = new Decimal(value);
      return acc;
    }, {} as BorrowingLimits);
  }

  /**
   * Get latest interest rates of m-wallet.
   * @returns {Promise<BorrowingInterestRates>} A promise that resolves to the latest interest rates.
   */
  async getInterestRates(): Promise<BorrowingInterestRates> {
    const response = await this.#restHandler.get<Record<string, { hourlyInterestRate: string, nextHourlyInterestRate: string }>>('/wallet/m/interest_rates');
    return Object.entries(response).reduce((acc, [key, value]) => {
      acc[key] = {
        hourlyInterestRate: new Decimal(value.hourlyInterestRate),
        nextHourlyInterestRate: new Decimal(value.nextHourlyInterestRate)
      };
      return acc;
    }, {} as BorrowingInterestRates);
  }

  /**
   * Get all available markets.
   * @returns {Promise<Market[]>} A promise that resolves to an array of Market objects.
   */
  async getMarkets(): Promise<Market[]> {
    const response = await this.#restHandler.get<any[]>('/markets');
    return response.map(this.#convertToMarket);
  }

  /**
   * Get all available currencies.
   * @returns {Promise<Currency[]>} A promise that resolves to an array of Currency objects.
   */
  async getCurrencies(): Promise<Currency[]> {
    const response = await this.#restHandler.get<any[]>('/currencies');
    return response.map(this.#convertToCurrency);
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
   * @param {z.infer<typeof GetKLineParamsSchema>} params - The parameters for fetching K-line data.
   * @returns {Promise<[number, string, string, string, string, string][]>} A promise that resolves to an array of K-line data.
   */
  async getKLine(params: z.infer<typeof GetKLineParamsSchema>): Promise<[Date, Decimal, Decimal, Decimal, Decimal, Decimal][]> {
    const validatedParams = GetKLineParamsSchema.parse(params);
    const response = await this.#restHandler.get<[number, string, string, string, string, string][]>('/k', validatedParams);
    return response.map(([timestamp, open, high, low, close, volume]) => [
      new Date(timestamp * 1000),
      new Decimal(open),
      new Decimal(high),
      new Decimal(low),
      new Decimal(close),
      new Decimal(volume)
    ]);
  }
  /**
   * Get depth of a specified market.
   * @param {z.infer<typeof GetDepthParamsSchema>} params - The parameters for fetching market depth.
   * @returns {Promise<Depth>} A promise that resolves to an object containing ask and bid orders, and timestamp.
   */
  async getDepth(params: z.infer<typeof GetDepthParamsSchema>): Promise<Depth> {
    const validatedParams = GetDepthParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/depth', validatedParams);
    return this.#convertToDepth(response);
  }

  /**
   * Get recent trades on market, sorted in reverse creation order.
   * @param {z.infer<typeof GetPublicTradesParamsSchema>} params - The parameters for fetching public trades.
   * @returns {Promise<PublicTrade[]>} A promise that resolves to an array of PublicTrade objects.
   */
  async getPublicTrades(params: z.infer<typeof GetPublicTradesParamsSchema>): Promise<PublicTrade[]> {
    const validatedParams = GetPublicTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/trades', validatedParams);
    return response.map(this.#convertToPublicTrade);
  }

  /**
   * Get ticker of all markets.
   * @param {z.infer<typeof GetTickersParamsSchema>} params - The parameters for fetching tickers.
   * @returns {Promise<Ticker[]>} A promise that resolves to an array of Ticker objects.
   */
  async getTickers(params: z.infer<typeof GetTickersParamsSchema>): Promise<Ticker[]> {
    const validatedParams = GetTickersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/tickers', validatedParams);
    return response.map(this.#convertToTicker);
  }

  /**
   * Get ticker of specific market.
   * @param {z.infer<typeof GetTickerParamsSchema>} params - The parameters for fetching a specific ticker.
   * @returns {Promise<Ticker>} A promise that resolves to a Ticker object.
   */
  async getTicker(params: z.infer<typeof GetTickerParamsSchema>): Promise<Ticker> {
    const validatedParams = GetTickerParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/ticker', validatedParams);
    return this.#convertToTicker(response);
  }

  /* WALLET REGION */

  /**
   * Get your account balance with all supported currencies by different wallet type.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof GetAccountsParamsSchema>} params - The parameters for fetching account balances.
   * @returns {Promise<Account[]>} A promise that resolves to an array of Account objects.
   */
  async getAccounts(walletType: WalletType, params: z.infer<typeof GetAccountsParamsSchema>): Promise<Account[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = GetAccountsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${validatedWalletType}/accounts`, validatedParams);
    return response.map(this.#convertToAccount);
  }

  /**
   * Get the latest AD ratio of your m-wallet.
   * @returns {Promise<AdRatio>} A promise that resolves to an AdRatio object.
   */
  async getAdRatio(): Promise<AdRatio> {
    const response = await this.#restHandler.get<any>('/wallet/m/ad_ratio');
    return this.#convertToAdRatio(response);
  }

  /**
   * Create a loan request for your m-wallet.
   * @param {z.infer<typeof SubmitLoanParamsSchema>} params - The parameters for submitting a loan.
   * @returns {Promise<Debt>} A promise that resolves to a Debt object.
   */
  async submitLoan(params: z.infer<typeof SubmitLoanParamsSchema>): Promise<Debt> {
    const validatedParams = SubmitLoanParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/loan', validatedParams);
    return this.#convertToDebt(response);
  }

  /**
   * Get loan history of your m-wallet.
   * @param {z.infer<typeof GetLoansParamsSchema>} params - The parameters for fetching loan history.
   * @returns {Promise<Debt[]>} A promise that resolves to an array of Debt objects.
   */
  async getLoans(params: z.infer<typeof GetLoansParamsSchema>): Promise<Debt[]> {
    const validatedParams = GetLoansParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/loans', validatedParams);
    return response.map(this.#convertToDebt);
  }

  /**
   * Make a repayment for your loan.
   * @param {z.infer<typeof SubmitRepaymentParamsSchema>} params - The parameters for submitting a repayment.
   * @returns {Promise<ManualRepayment>} A promise that resolves to a ManualRepayment object.
   */
  async submitRepayment(params: z.infer<typeof SubmitRepaymentParamsSchema>): Promise<ManualRepayment> {
    const validatedParams = SubmitRepaymentParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/repayment', validatedParams);
    return this.#convertToManualRepayment(response);
  }

  /**
   * Get repayment history of your m-wallet.
   * @param {z.infer<typeof GetRepaymentsParamsSchema>} params - The parameters for fetching repayment history.
   * @returns {Promise<ManualRepayment[]>} A promise that resolves to an array of ManualRepayment objects.
   */
  async getRepayments(params: z.infer<typeof GetRepaymentsParamsSchema>): Promise<ManualRepayment[]> {
    const validatedParams = GetRepaymentsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/repayments', validatedParams);
    return response.map(this.#convertToManualRepayment);
  }

  /**
   * Get liquidation history of your m-wallet.
   * @param {z.infer<typeof GetLiquidationsParamsSchema>} params - The parameters for fetching liquidation history.
   * @returns {Promise<Liquidation[]>} A promise that resolves to an array of Liquidation objects.
   */
  async getLiquidations(params: z.infer<typeof GetLiquidationsParamsSchema>): Promise<Liquidation[]> {
    const validatedParams = GetLiquidationsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/liquidations', validatedParams);
    return response.map(this.#convertToLiquidation);
  }

  /**
   * Get detail of one specific liquidation history of your m-wallet.
   * @param {z.infer<typeof GetLiquidationDetailParamsSchema>} params - The parameters for fetching liquidation detail.
   * @returns {Promise<LiquidationDetail>} A promise that resolves to a LiquidationDetail object.
   */
  async getLiquidationDetail(params: z.infer<typeof GetLiquidationDetailParamsSchema>): Promise<LiquidationDetail> {
    const validatedParams = GetLiquidationDetailParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/wallet/m/liquidation', validatedParams);
    return this.#convertToLiquidationDetail(response);
  }

  /**
   * Get interest history of your m-wallet.
   * @param {z.infer<typeof GetInterestsParamsSchema>} params - The parameters for fetching interest history.
   * @returns {Promise<Interest[]>} A promise that resolves to an array of Interest objects.
   */
  async getInterests(params: z.infer<typeof GetInterestsParamsSchema>): Promise<Interest[]> {
    const validatedParams = GetInterestsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/interests', validatedParams);
    return response.map(this.#convertToInterest);
  }

  /**
   * Get withdraw addresses of spot wallet.
   * @param {z.infer<typeof GetWithdrawAddressesParamsSchema>} params - The parameters for fetching withdraw addresses.
   * @returns {Promise<FundSource[]>} A promise that resolves to an array of FundSource objects.
   */
  async getWithdrawAddresses(params: z.infer<typeof GetWithdrawAddressesParamsSchema>): Promise<FundSource[]> {
    const validatedParams = GetWithdrawAddressesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/withdraw_addresses', validatedParams);
    return response.map(this.#convertToFundSource);
  }

  /* ORDER REGION */

  /**
   * Get open orders.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof FetchOrdersParamsSchema>} params - The parameters for fetching open orders.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getOpenOrders(walletType: WalletType, params: z.infer<typeof FetchOrdersParamsSchema>): Promise<Order[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = FetchOrdersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${validatedWalletType}/orders/open`, validatedParams);
    return response.map(this.#convertToOrder);
  }

  /**
   * Get closed orders.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof FetchOrdersParamsSchema>} params - The parameters for fetching closed orders.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getClosedOrders(walletType: WalletType, params: z.infer<typeof FetchOrdersParamsSchema>): Promise<Order[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = FetchOrdersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${validatedWalletType}/orders/closed`, validatedParams);
    return response.map(this.#convertToOrder);
  }

  /**
   * Get order history in ascending order from a specific from_id.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof GetOrderHistoryParamsSchema>} params - The parameters for fetching order history.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getOrderHistory(walletType: WalletType, params: z.infer<typeof GetOrderHistoryParamsSchema>): Promise<Order[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = GetOrderHistoryParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${validatedWalletType}/orders/history`, validatedParams);
    return response.map(this.#convertToOrder);
  }

  /**
   * Create sell/buy order.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof SubmitOrderParamsSchema>} params - The parameters for submitting an order.
   * @returns {Promise<Order>} A promise that resolves to an Order object.
   */
  async submitOrder(walletType: WalletType, params: z.infer<typeof SubmitOrderParamsSchema>): Promise<Order> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = SubmitOrderParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>(`/wallet/${validatedWalletType}/order`, validatedParams);
    return this.#convertToOrder(response);
  }

  /**
   * Cancel all your orders with given market and side in different wallet type.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof CancelAllOrdersParamsSchema>} params - The parameters for cancelling all orders.
   * @returns {Promise<{ success: boolean }[]>} A promise that resolves to an array of objects indicating success for each cancelled order.
   */
  async cancelAllOrders(walletType: WalletType, params: z.infer<typeof CancelAllOrdersParamsSchema>): Promise<{ success: boolean }[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = CancelAllOrdersParamsSchema.parse(params);
    return this.#restHandler.delete<{ success: boolean }[]>(`/wallet/${validatedWalletType}/orders`, validatedParams);
  }

  /**
   * Get order detail.
   * @param {z.infer<typeof GetOrderParamsSchema>} params - The parameters for fetching order details.
   * @returns {Promise<Order>} A promise that resolves to an Order object.
   */
  async getOrder(params: z.infer<typeof GetOrderParamsSchema>): Promise<Order> {
    const validatedParams = GetOrderParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/order', validatedParams);
    return this.#convertToOrder(response);
  }

  /**
   * Cancel an order.
   * @param {z.infer<typeof CancelOrderParamsSchema>} params - The parameters for cancelling an order.
   * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating success.
   */
  async cancelOrder(params: z.infer<typeof CancelOrderParamsSchema>): Promise<{ success: boolean }> {
    const validatedParams = CancelOrderParamsSchema.parse(params);
    return this.#restHandler.delete<{ success: boolean }>('/order', validatedParams);
  }

  /* TRADE REGION */

  /**
   * Get executed trades.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof GetTradesParamsSchema>} params - The parameters for fetching trades.
   * @returns {Promise<Trade[]>} A promise that resolves to an array of Trade objects.
   */
  async getTrades(walletType: WalletType, params: z.infer<typeof GetTradesParamsSchema>): Promise<Trade[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = GetTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${validatedWalletType}/trades`, validatedParams);
    return response.map(this.#convertToTrade);
  }

  /**
   * Get trade detail by your order info.
   * @param {z.infer<typeof GetOrderTradesParamsSchema>} params - The parameters for fetching order trades.
   * @returns {Promise<Trade[]>} A promise that resolves to an array of Trade objects.
   */
  async getOrderTrades(params: z.infer<typeof GetOrderTradesParamsSchema>): Promise<Trade[]> {
    const validatedParams = GetOrderTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/order/trades', validatedParams);
    return response.map(this.#convertToTrade);
  }

  /**
   * Create a transaction between your spot wallet and m-wallet.
   * @param {z.infer<typeof TransferBetweenWalletsParamsSchema>} params - The parameters for transferring between wallets.
   * @returns {Promise<BorrowingTransfer>} A promise that resolves to a BorrowingTransfer object.
   */
  async transferBetweenWallets(params: z.infer<typeof TransferBetweenWalletsParamsSchema>): Promise<BorrowingTransfer> {
    const validatedParams = TransferBetweenWalletsParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/wallet/m/transfer', validatedParams);
    return this.#convertToBorrowingTransfer(response);
  }

  /**
   * List transactions between your spot wallet and m-wallet.
   * @param {z.infer<typeof GetTransfersParamsSchema>} params - The parameters for fetching transfers.
   * @returns {Promise<BorrowingTransfer[]>} A promise that resolves to an array of BorrowingTransfer objects.
   */
  async getTransfers(params: z.infer<typeof GetTransfersParamsSchema>): Promise<BorrowingTransfer[]> {
    const validatedParams = GetTransfersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/wallet/m/transfers', validatedParams);
    return response.map(this.#convertToBorrowingTransfer);
  }

  /**
   * Get details of a specific external withdraw.
   * @param {z.infer<typeof GetWithdrawalParamsSchema>} params - The parameters for fetching withdrawal details.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async getWithdrawal(params: z.infer<typeof GetWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = GetWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/withdrawal', validatedParams);
    return this.#convertToWithdrawal(response);
  }

  /**
   * Submit a crypto withdrawal. IP whitelist for api token is required.
   * @param {z.infer<typeof SubmitWithdrawalParamsSchema>} params - The parameters for submitting a withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitWithdrawal(params: z.infer<typeof SubmitWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = SubmitWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/withdrawal', validatedParams);
    return this.#convertToWithdrawal(response);
  }

  /**
   * Submit twd withdrawal to verified bank account. IP whitelist for api token is required.
   * @param {z.infer<typeof SubmitTWDWithdrawalParamsSchema>} params - The parameters for submitting a TWD withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitTWDWithdrawal(params: z.infer<typeof SubmitTWDWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = SubmitTWDWithdrawalParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>('/withdrawal/twd', validatedParams);
    return this.#convertToWithdrawal(response);
  }

  /**
   * Get external withdrawals history.
   * @param {z.infer<typeof GetWithdrawalsParamsSchema>} params - The parameters for fetching withdrawal history.
   * @returns {Promise<Withdrawal[]>} A promise that resolves to an array of Withdrawal objects.
   */
  async getWithdrawals(params: z.infer<typeof GetWithdrawalsParamsSchema>): Promise<Withdrawal[]> {
    const validatedParams = GetWithdrawalsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/withdrawals', validatedParams);
    return response.map(this.#convertToWithdrawal);
  }

  /**
   * Get details of a specific deposit.
   * @param {z.infer<typeof GetDepositParamsSchema>} params - The parameters for fetching deposit details.
   * @returns {Promise<Deposit>} A promise that resolves to a Deposit object.
   */
  async getDeposit(params: z.infer<typeof GetDepositParamsSchema>): Promise<Deposit> {
    const validatedParams = GetDepositParamsSchema.parse(params);
    const response = await this.#restHandler.get<any>('/deposit', validatedParams);
    return this.#convertToDeposit(response);
  }

  /**
   * Get external deposits history.
   * @param {z.infer<typeof GetDepositsParamsSchema>} params - The parameters for fetching deposit history.
   * @returns {Promise<Deposit[]>} A promise that resolves to an array of Deposit objects.
   */
  async getDeposits(params: z.infer<typeof GetDepositsParamsSchema>): Promise<Deposit[]> {
    const validatedParams = GetDepositsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/deposits', validatedParams);
    return response.map(this.#convertToDeposit);
  }

  /**
   * Get internal transfers history.
   * @param {z.infer<typeof GetInternalTransfersParamsSchema>} params - The parameters for fetching internal transfer history.
   * @returns {Promise<InternalTransfer[]>} A promise that resolves to an array of InternalTransfer objects.
   */
  async getInternalTransfers(params: z.infer<typeof GetInternalTransfersParamsSchema>): Promise<InternalTransfer[]> {
    const validatedParams = GetInternalTransfersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/internal_transfers', validatedParams);
    return response.map(this.#convertToInternalTransfer);
  }

  /**
   * Get rewards history.
   * @param {z.infer<typeof GetRewardsParamsSchema>} params - The parameters for fetching rewards history.
   * @returns {Promise<Reward[]>} A promise that resolves to an array of Reward objects.
   */
  async getRewards(params: z.infer<typeof GetRewardsParamsSchema>): Promise<Reward[]> {
    const validatedParams = GetRewardsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>('/rewards', validatedParams);
    return response.map(this.#convertToReward);
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
    } else {
      return 'Local Time is synced.';
    }
  }

  // Private conversion methods

  #convertToIndexPrice = (data: any): IndexPrice => {
    return {
      timestamp: new Date(data.timestamp),
      price: new Decimal(data.price)
    };
  }

  #convertToMarket = (data: any): Market => {
    return {
      ...data,
      minBaseAmount: new Decimal(data.minBaseAmount),
      minQuoteAmount: new Decimal(data.minQuoteAmount)
    };
  }

  #convertToCurrency = (data: any): Currency => {
    return {
      ...data,
      minBorrowAmount: data.minBorrowAmount === '' ? null : new Decimal(data.minBorrowAmount),
      networks: data.networks.map((d) => { 
        console.log(this)
        return this.#convertToCurrencyNetwork(d) 
      })
    };
  }

  #convertToCurrencyNetwork = (data: any): CurrencyNetwork => {
    return {
      ...data,
      withdrawalFee: new Decimal(data.withdrawalFee),
      minWithdrawalAmount: new Decimal(data.minWithdrawalAmount)
    };
  }

  #convertToDepth = (data: any): Depth => {
    return {
      timestamp: new Date(data.timestamp * 1000),
      lastUpdateVersion: data.lastUpdateVersion,
      lastUpdateId: data.lastUpdateId,
      asks: data.asks.map(this.#convertToPriceLevel),
      bids: data.bids.map(this.#convertToPriceLevel)
    };
  }

  #convertToPriceLevel = ([price, amount]: [string, string]): PriceLevel => {
    return {
      price: new Decimal(price),
      amount: new Decimal(amount)
    };
  }

  #convertToPublicTrade = (data: any): PublicTrade => {
    return {
      ...data,
      price: new Decimal(data.price),
      volume: new Decimal(data.volume),
      funds: new Decimal(data.funds),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToTicker = (data: any): Ticker => {
    return {
      ...data,
      at: new Date(data.at * 1000),
      buy: new Decimal(data.buy),
      buyVol: new Decimal(data.buyVol),
      sell: new Decimal(data.sell),
      sellVol: new Decimal(data.sellVol),
      open: new Decimal(data.open),
      low: new Decimal(data.low),
      high: new Decimal(data.high),
      last: new Decimal(data.last),
      vol: new Decimal(data.vol),
      volInBtc: new Decimal(data.volInBtc)
    };
  }

  #convertToAccount= (data: any): Account => {
    return {
      ...data,
      balance: new Decimal(data.balance),
      locked: new Decimal(data.locked),
      staked: data.staked ? new Decimal(data.staked) : null,
      principal: data.principal ? new Decimal(data.principal) : undefined,
      interest: data.interest ? new Decimal(data.interest) : undefined
    };
  }

  #convertToAdRatio = (data: any): AdRatio => {
    return {
      adRatio: new Decimal(data.adRatio),
      assetInUsdt: new Decimal(data.assetInUsdt),
      debtInUsdt: new Decimal(data.debtInUsdt)
    };
  }

  #convertToDebt = (data: any): Debt => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      createdAt: new Date(data.createdAt),
      interestRate: new Decimal(data.interestRate)
    };
  }

  #convertToManualRepayment = (data: any): ManualRepayment => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      principal: new Decimal(data.principal),
      interest: new Decimal(data.interest),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToLiquidation = (data: any): Liquidation => {
    return {
      ...data,
      adRatio: new Decimal(data.adRatio),
      expectedAdRatio: new Decimal(data.expectedAdRatio),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToLiquidationDetail = (data: any): LiquidationDetail => {
    return {
      ...this.#convertToLiquidation(data),
      repayments: data.repayments.map(this.#convertToRepayment),
      liquidations: data.liquidations.map(this.#convertToForcedLiquidation)
    };
  }

  #convertToRepayment = (data: any): Repayment => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      principal: new Decimal(data.principal),
      interest: new Decimal(data.interest)
    };
  }

  #convertToForcedLiquidation = (data: any): ForcedLiquidation => {
    return {
      ...data,
      price: new Decimal(data.price),
      volume: new Decimal(data.volume),
      fee: new Decimal(data.fee),
      repayment: this.#convertToRepayment(data.repayment)
    };
  }

  #convertToInterest = (data: any): Interest => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      interestRate: new Decimal(data.interestRate),
      principal: new Decimal(data.principal),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToFundSource = (data: any): FundSource => {
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToOrder = (data: any): Order => {
    return {
      ...data,
      price: data.price ? new Decimal(data.price) : null,
      stopPrice: data.stopPrice ? new Decimal(data.stopPrice) : null,
      avgPrice: new Decimal(data.avgPrice),
      volume: new Decimal(data.volume),
      remainingVolume: new Decimal(data.remainingVolume),
      executedVolume: new Decimal(data.executedVolume),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  #convertToTrade = (data: any): Trade => {
    return {
      ...data,
      price: new Decimal(data.price),
      volume: new Decimal(data.volume),
      funds: new Decimal(data.funds),
      fee: data.fee ? new Decimal(data.fee) : null,
      selfTradeBidFee: data.selfTradeBidFee ? new Decimal(data.selfTradeBidFee) : null,
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToBorrowingTransfer = (data: any): BorrowingTransfer => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToWithdrawal = (data: any): Withdrawal => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      fee: new Decimal(data.fee),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToDeposit = (data: any): Deposit => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToInternalTransfer = (data: any): InternalTransfer => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToReward = (data: any): Reward => {
    return {
      ...data,
      amount: new Decimal(data.amount),
      createdAt: new Date(data.createdAt)
    };
  }

  #convertToUserInfo = (data: any): UserInfo => {
    return {
      ...data,
      currentVipLevel: this.#convertToVipLevel(data.currentVipLevel),
      nextVipLevel: data.nextVipLevel ? this.#convertToVipLevel(data.nextVipLevel) : null
    };
  }

  #convertToVipLevel = (data: any): VipLevel => {
    return {
      ...data,
      minimumTradingVolume: new Decimal(data.minimumTradingVolume),
      minimumStakingVolume: new Decimal(data.minimumStakingVolume),
      makerFee: new Decimal(data.makerFee),
      takerFee: new Decimal(data.takerFee)
    };
  }
}

export default MaxSDK;
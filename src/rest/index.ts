import { z } from 'zod';
import RestHandler from './rest';
import { Account, AdRatio, BorrowingLimits, BorrowingInterestRates, BorrowingTransfer, Currency, Debt, Deposit, FundSource, IndexPrice, Interest, InternalTransfer, Liquidation, LiquidationDetail, ManualRepayment, Market, Order, PublicTrade, Reward, Ticker, Timestamp, Trade, UserInfo, Withdrawal, Depth } from './types';
import { CancelAllOrdersParamsSchema, CancelOrderParamsSchema, FetchOrdersParamsSchema, GetAccountsParamsSchema, GetDepositParamsSchema, GetDepositsParamsSchema, GetDepthParamsSchema, GetInterestsParamsSchema, GetInternalTransfersParamsSchema, GetKLineParamsSchema, GetLiquidationDetailParamsSchema, GetLiquidationsParamsSchema, GetLoansParamsSchema, GetOrderHistoryParamsSchema, GetOrderParamsSchema, GetOrderTradesParamsSchema, GetPublicTradesParamsSchema, GetRepaymentsParamsSchema, GetRewardsParamsSchema, GetTickerParamsSchema, GetTickersParamsSchema, GetTradesParamsSchema, GetTransfersParamsSchema, GetWithdrawAddressesParamsSchema, GetWithdrawalParamsSchema, GetWithdrawalsParamsSchema, HistoricalIndexPricesParamsSchema, SubmitLoanParamsSchema, SubmitOrderParamsSchema, SubmitRepaymentParamsSchema, SubmitTWDWithdrawalParamsSchema, SubmitWithdrawalParamsSchema, TransferBetweenWalletsParamsSchema, WalletType, WalletTypeSchema } from './schema';
import { BASE_URL } from '../config';

class MaxSDK {
  #restHandler: RestHandler;
  constructor(accessKey: string, secretKey: string, url = BASE_URL) {
    this.#restHandler = new RestHandler(url, '/api/v3', accessKey, secretKey);
  }

  /* USER REGION */
  /**
   * Get user information.
   * @returns {Promise<UserInfo>} A promise that resolves to a UserInfo object.
   */
  async getUserInfo(): Promise<UserInfo> {
    return this.#restHandler.get<UserInfo>('/info');
  }

  /* PUBLIC REGION */
  /**
   * Get latest index prices of m-wallet.
   * @returns {Promise<IndexPrice[]>} A promise that resolves to an array of IndexPrice objects.
   */
  async getIndexPrices(): Promise<IndexPrice[]> {
    return this.#restHandler.get<IndexPrice[]>('/wallet/m/index_prices');
  }

  /**
   * Get latest historical index prices.
   * @param {z.infer<typeof HistoricalIndexPricesParamsSchema>} params - The parameters for fetching historical index prices.
   * @returns {Promise<IndexPrice[]>} A promise that resolves to an array of IndexPrice objects.
   */
  async getHistoricalIndexPrices(params: z.infer<typeof HistoricalIndexPricesParamsSchema>): Promise<IndexPrice[]> {
    const validatedParams = HistoricalIndexPricesParamsSchema.parse(params);
    return this.#restHandler.get<IndexPrice[]>('/wallet/m/historical_index_prices', validatedParams);
  }

  /**
   * Get total available loan amount.
   * @returns {Promise<BorrowingLimits>} A promise that resolves to the available loan amount.
   */
  async getLimits(): Promise<BorrowingLimits> {
    return this.#restHandler.get<BorrowingLimits>('/wallet/m/limits');
  }

  /**
   * Get latest interest rates of m-wallet.
   * @returns {Promise<BorrowingInterestRates>} A promise that resolves to the latest interest rates.
   */
  async getInterestRates(): Promise<BorrowingInterestRates> {
    return this.#restHandler.get<BorrowingInterestRates>('/wallet/m/interest_rates');
  }

  /**
   * Get all available markets.
   * @returns {Promise<Market[]>} A promise that resolves to an array of Market objects.
   */
  async getMarkets(): Promise<Market[]> {
    return this.#restHandler.get<Market[]>('/markets');
  }

  /**
   * Get all available currencies.
   * @returns {Promise<Currency[]>} A promise that resolves to an array of Currency objects.
   */
  async getCurrencies(): Promise<Currency[]> {
    return this.#restHandler.get<Currency[]>('/currencies');
  }

  /**
   * Get server current time, in seconds since Unix epoch.
   * @returns {Promise<Timestamp>} A promise that resolves to a Timestamp object.
   */
  async getTimestamp(): Promise<Timestamp> {
    return this.#restHandler.get<Timestamp>('/timestamp');
  }

  /**
   * Get OHLC(k line) of a specific market.
   * @param {z.infer<typeof GetKLineParamsSchema>} params - The parameters for fetching K-line data.
   * @returns {Promise<[number, string, string, string, string, string][]>} A promise that resolves to an array of K-line data.
   */
  async getKLine(params: z.infer<typeof GetKLineParamsSchema>): Promise<[number, string, string, string, string, string][]> {
    const validatedParams = GetKLineParamsSchema.parse(params);
    return this.#restHandler.get<[number, string, string, string, string, string][]>('/k', validatedParams);
  }

  /**
   * Get depth of a specified market.
   * @param {z.infer<typeof GetDepthParamsSchema>} params - The parameters for fetching market depth.
   * @returns {Promise<Depth>} A promise that resolves to an object containing ask and bid orders, and timestamp.
   */
  async getDepth(params: z.infer<typeof GetDepthParamsSchema>): Promise<Depth> {
    const validatedParams = GetDepthParamsSchema.parse(params);
    return this.#restHandler.get<Depth>('/depth', validatedParams);
  }

  /**
   * Get recent trades on market, sorted in reverse creation order.
   * @param {z.infer<typeof GetPublicTradesParamsSchema>} params - The parameters for fetching public trades.
   * @returns {Promise<PublicTrade[]>} A promise that resolves to an array of PublicTrade objects.
   */
  async getPublicTrades(params: z.infer<typeof GetPublicTradesParamsSchema>): Promise<PublicTrade[]> {
    const validatedParams = GetPublicTradesParamsSchema.parse(params);
    return this.#restHandler.get<PublicTrade[]>('/trades', validatedParams);
  }

  /**
   * Get ticker of all markets.
   * @param {z.infer<typeof GetTickersParamsSchema>} params - The parameters for fetching tickers.
   * @returns {Promise<Ticker[]>} A promise that resolves to an array of Ticker objects.
   */
  async getTickers(params: z.infer<typeof GetTickersParamsSchema>): Promise<Ticker[]> {
    const validatedParams = GetTickersParamsSchema.parse(params);
    return this.#restHandler.get<Ticker[]>('/tickers', validatedParams);
  }

  /**
   * Get ticker of specific market.
   * @param {z.infer<typeof GetTickerParamsSchema>} params - The parameters for fetching a specific ticker.
   * @returns {Promise<Ticker>} A promise that resolves to a Ticker object.
   */
  async getTicker(params: z.infer<typeof GetTickerParamsSchema>): Promise<Ticker> {
    const validatedParams = GetTickerParamsSchema.parse(params);
    return this.#restHandler.get<Ticker>('/ticker', validatedParams);
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
    return this.#restHandler.get<Account[]>(`/wallet/${validatedWalletType}/accounts`, validatedParams);
  }

  /**
   * Get the latest AD ratio of your m-wallet.
   * @returns {Promise<AdRatio>} A promise that resolves to an AdRatio object.
   */
  async getAdRatio(): Promise<AdRatio> {
    return this.#restHandler.get<AdRatio>('/wallet/m/ad_ratio');
  }

  /**
   * Create a loan request for your m-wallet.
   * @param {z.infer<typeof SubmitLoanParamsSchema>} params - The parameters for submitting a loan.
   * @returns {Promise<Debt>} A promise that resolves to a Debt object.
   */
  async submitLoan(params: z.infer<typeof SubmitLoanParamsSchema>): Promise<Debt> {
    const validatedParams = SubmitLoanParamsSchema.parse(params);
    return this.#restHandler.post<Debt>('/wallet/m/loan', validatedParams);
  }

  /**
   * Get loan history of your m-wallet.
   * @param {z.infer<typeof GetLoansParamsSchema>} params - The parameters for fetching loan history.
   * @returns {Promise<Debt[]>} A promise that resolves to an array of Debt objects.
   */
  async getLoans(params: z.infer<typeof GetLoansParamsSchema>): Promise<Debt[]> {
    const validatedParams = GetLoansParamsSchema.parse(params);
    return this.#restHandler.get<Debt[]>('/wallet/m/loans', validatedParams);
  }

  /**
   * Make a repayment for your loan.
   * @param {z.infer<typeof SubmitRepaymentParamsSchema>} params - The parameters for submitting a repayment.
   * @returns {Promise<ManualRepayment>} A promise that resolves to a ManualRepayment object.
   */
  async submitRepayment(params: z.infer<typeof SubmitRepaymentParamsSchema>): Promise<ManualRepayment> {
    const validatedParams = SubmitRepaymentParamsSchema.parse(params);
    return this.#restHandler.post<ManualRepayment>('/wallet/m/repayment', validatedParams);
  }

  /**
   * Get repayment history of your m-wallet.
   * @param {z.infer<typeof GetRepaymentsParamsSchema>} params - The parameters for fetching repayment history.
   * @returns {Promise<ManualRepayment[]>} A promise that resolves to an array of ManualRepayment objects.
   */
  async getRepayments(params: z.infer<typeof GetRepaymentsParamsSchema>): Promise<ManualRepayment[]> {
    const validatedParams = GetRepaymentsParamsSchema.parse(params);
    return this.#restHandler.get<ManualRepayment[]>('/wallet/m/repayments', validatedParams);
  }

  /**
   * Get liquidation history of your m-wallet.
   * @param {z.infer<typeof GetLiquidationsParamsSchema>} params - The parameters for fetching liquidation history.
   * @returns {Promise<Liquidation[]>} A promise that resolves to an array of Liquidation objects.
   */
  async getLiquidations(params: z.infer<typeof GetLiquidationsParamsSchema>): Promise<Liquidation[]> {
    const validatedParams = GetLiquidationsParamsSchema.parse(params);
    return this.#restHandler.get<Liquidation[]>('/wallet/m/liquidations', validatedParams);
  }

  /**
   * Get detail of one specific liquidation history of your m-wallet.
   * @param {z.infer<typeof GetLiquidationDetailParamsSchema>} params - The parameters for fetching liquidation detail.
   * @returns {Promise<LiquidationDetail>} A promise that resolves to a LiquidationDetail object.
   */
  async getLiquidationDetail(params: z.infer<typeof GetLiquidationDetailParamsSchema>): Promise<LiquidationDetail> {
    const validatedParams = GetLiquidationDetailParamsSchema.parse(params);
    return this.#restHandler.get<LiquidationDetail>('/wallet/m/liquidation', validatedParams);
  }

  /**
   * Get interest history of your m-wallet.
   * @param {z.infer<typeof GetInterestsParamsSchema>} params - The parameters for fetching interest history.
   * @returns {Promise<Interest[]>} A promise that resolves to an array of Interest objects.
   */
  async getInterests(params: z.infer<typeof GetInterestsParamsSchema>): Promise<Interest[]> {
    const validatedParams = GetInterestsParamsSchema.parse(params);
    return this.#restHandler.get<Interest[]>('/wallet/m/interests', validatedParams);
  }

  /**
   * Get withdraw addresses of spot wallet.
   * @param {z.infer<typeof GetWithdrawAddressesParamsSchema>} params - The parameters for fetching withdraw addresses.
   * @returns {Promise<FundSource[]>} A promise that resolves to an array of FundSource objects.
   */
  async getWithdrawAddresses(params: z.infer<typeof GetWithdrawAddressesParamsSchema>): Promise<FundSource[]> {
    const validatedParams = GetWithdrawAddressesParamsSchema.parse(params);
    return this.#restHandler.get<FundSource[]>('/withdraw_addresses', validatedParams);
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
    return this.#restHandler.get<Order[]>(`/wallet/${validatedWalletType}/orders/open`, validatedParams);
  }

  /**
   * Get closed orders.
   * @param {WalletType} walletType - The wallet type (spot or m).
   * @param {z.infer<typeof FetchOrdersParamsSchema>} params - The parameters for fetching closed orders.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getCloseOrders(walletType: WalletType, params: z.infer<typeof FetchOrdersParamsSchema>): Promise<Order[]> {
    const validatedWalletType = WalletTypeSchema.parse(walletType);
    const validatedParams = FetchOrdersParamsSchema.parse(params);
    return this.#restHandler.get<Order[]>(`/wallet/${validatedWalletType}/orders/closed`, validatedParams);
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
    return this.#restHandler.get<Order[]>(`/api/v3/wallet/${validatedWalletType}/orders/history`, validatedParams);
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
    return this.#restHandler.post<Order>(`/wallet/${validatedWalletType}/order`, validatedParams);
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
    return this.#restHandler.get<Order>('/order', validatedParams);
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
    return this.#restHandler.get<Trade[]>(`/wallet/${validatedWalletType}/trades`, validatedParams);
  }

  /**
   * Get trade detail by your order info.
   * @param {z.infer<typeof GetOrderTradesParamsSchema>} params - The parameters for fetching order trades.
   * @returns {Promise<Trade[]>} A promise that resolves to an array of Trade objects.
   */
  async getOrderTrades(params: z.infer<typeof GetOrderTradesParamsSchema>): Promise<Trade[]> {
    const validatedParams = GetOrderTradesParamsSchema.parse(params);
    return this.#restHandler.get<Trade[]>('/order/trades', validatedParams);
  }

  /* TRANSACTION REGION */

  /**
   * Create a transaction between your spot wallet and m-wallet.
   * @param {z.infer<typeof TransferBetweenWalletsParamsSchema>} params - The parameters for transferring between wallets.
   * @returns {Promise<BorrowingTransfer>} A promise that resolves to a BorrowingTransfer object.
   */
  async transferBetweenWallets(params: z.infer<typeof TransferBetweenWalletsParamsSchema>): Promise<BorrowingTransfer> {
    const validatedParams = TransferBetweenWalletsParamsSchema.parse(params);
    return this.#restHandler.post<BorrowingTransfer>('/wallet/m/transfer', validatedParams);
  }

  /**
   * List transactions between your spot wallet and m-wallet.
   * @param {z.infer<typeof GetTransfersParamsSchema>} params - The parameters for fetching transfers.
   * @returns {Promise<BorrowingTransfer[]>} A promise that resolves to an array of BorrowingTransfer objects.
   */
  async getTransfers(params: z.infer<typeof GetTransfersParamsSchema>): Promise<BorrowingTransfer[]> {
    const validatedParams = GetTransfersParamsSchema.parse(params);
    return this.#restHandler.get<BorrowingTransfer[]>('/wallet/m/transfers', validatedParams);
  }

  /**
   * Get details of a specific external withdraw.
   * @param {z.infer<typeof GetWithdrawalParamsSchema>} params - The parameters for fetching withdrawal details.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async getWithdrawal(params: z.infer<typeof GetWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = GetWithdrawalParamsSchema.parse(params);
    return this.#restHandler.get<Withdrawal>('/withdrawal', validatedParams);
  }

  /**
   * Submit a crypto withdrawal. IP whitelist for api token is required.
   * @param {z.infer<typeof SubmitWithdrawalParamsSchema>} params - The parameters for submitting a withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitWithdrawal(params: z.infer<typeof SubmitWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = SubmitWithdrawalParamsSchema.parse(params);
    return this.#restHandler.post<Withdrawal>('/withdrawal', validatedParams);
  }

  /**
   * Submit twd withdrawal to verified bank account. IP whitelist for api token is required.
   * @param {z.infer<typeof SubmitTWDWithdrawalParamsSchema>} params - The parameters for submitting a TWD withdrawal.
   * @returns {Promise<Withdrawal>} A promise that resolves to a Withdrawal object.
   */
  async submitTWDWithdrawal(params: z.infer<typeof SubmitTWDWithdrawalParamsSchema>): Promise<Withdrawal> {
    const validatedParams = SubmitTWDWithdrawalParamsSchema.parse(params);
    return this.#restHandler.post<Withdrawal>('/withdrawal/twd', validatedParams);
  }

  /**
   * Get external withdrawals history.
   * @param {z.infer<typeof GetWithdrawalsParamsSchema>} params - The parameters for fetching withdrawal history.
   * @returns {Promise<Withdrawal[]>} A promise that resolves to an array of Withdrawal objects.
   */
  async getWithdrawals(params: z.infer<typeof GetWithdrawalsParamsSchema>): Promise<Withdrawal[]> {
    const validatedParams = GetWithdrawalsParamsSchema.parse(params);
    return this.#restHandler.get<Withdrawal[]>('/withdrawals', validatedParams);
  }

  /**
   * Get details of a specific deposit.
   * @param {z.infer<typeof GetDepositParamsSchema>} params - The parameters for fetching deposit details.
   * @returns {Promise<Deposit>} A promise that resolves to a Deposit object.
   */
  async getDeposit(params: z.infer<typeof GetDepositParamsSchema>): Promise<Deposit> {
    const validatedParams = GetDepositParamsSchema.parse(params);
    return this.#restHandler.get<Deposit>('/deposit', validatedParams);
  }

  /**
   * Get external deposits history.
   * @param {z.infer<typeof GetDepositsParamsSchema>} params - The parameters for fetching deposit history.
   * @returns {Promise<Deposit[]>} A promise that resolves to an array of Deposit objects.
   */
  async getDeposits(params: z.infer<typeof GetDepositsParamsSchema>): Promise<Deposit[]> {
    const validatedParams = GetDepositsParamsSchema.parse(params);
    return this.#restHandler.get<Deposit[]>('/deposits', validatedParams);
  }

  /**
   * Get internal transfers history.
   * @param {z.infer<typeof GetInternalTransfersParamsSchema>} params - The parameters for fetching internal transfer history.
   * @returns {Promise<InternalTransfer[]>} A promise that resolves to an array of InternalTransfer objects.
   */
  async getInternalTransfers(params: z.infer<typeof GetInternalTransfersParamsSchema>): Promise<InternalTransfer[]> {
    const validatedParams = GetInternalTransfersParamsSchema.parse(params);
    return this.#restHandler.get<InternalTransfer[]>('/internal_transfers', validatedParams);
  }

  /**
   * Get rewards history.
   * @param {z.infer<typeof GetRewardsParamsSchema>} params - The parameters for fetching rewards history.
   * @returns {Promise<Reward[]>} A promise that resolves to an array of Reward objects.
   */
  async getRewards(params: z.infer<typeof GetRewardsParamsSchema>): Promise<Reward[]> {
    const validatedParams = GetRewardsParamsSchema.parse(params);
    return this.#restHandler.get<Reward[]>('/rewards', validatedParams);
  }

  /**
   * Calibrate the local time with the server time.
   * This method fetches the server time and compares it with the local time.
   * If the difference is larger than 30 seconds, it adjusts the local time difference.
   * @returns {Promise<string>} A promise that resolves to a string message indicating whether the time was synced or not.
   */
  async calibrateTime(): Promise<string> {
    const data = await this.getTimestamp();
    const systemTime = data.timestamp * 1000;
    const localTime = Date.now();
    const diff = localTime - systemTime;
    /* Only calibrate local time when diff is larger than 30 seconds */
    if (Math.abs(diff) >= 30 * 1000) {
      this.#restHandler.setDiff(diff);
      return `Local Time synced, diff was ${diff} ms.`;
    } else {
      return 'Local Time is synced.';
    }
  }
}

export default MaxSDK;

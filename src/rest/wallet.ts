import {
  convertToAccount,
  convertToOrder,
  convertToTrade,
} from './converter.js';
import RestHandler from './rest.js';
import {
  type CancelAllOrdersParams,
  CancelAllOrdersParamsSchema,
  type FetchOrdersParams,
  FetchOrdersParamsSchema,
  type GetAccountsParams,
  GetAccountsParamsSchema,
  type GetOrderHistoryParams,
  GetOrderHistoryParamsSchema,
  type GetTradesParams,
  GetTradesParamsSchema,
  type SubmitOrderParams,
  SubmitOrderParamsSchema,
  WalletType,
} from './schema.js';
import type {
  Account,
  Order,
  Trade,
} from './types.js';

export default class Wallet {
  #walletType: WalletType;
  #restHandler: RestHandler;

  /** @ignore */
  constructor(private restHandler: RestHandler, private walletType: WalletType) {
    this.#walletType = walletType;
    this.#restHandler = restHandler;
  }

  /**
  * Get your account balance with all supported currencies by different wallet type.
  * @param {GetAccountsParams} params - The parameters for fetching account balances.
  * @returns {Promise<Account[]>} A promise that resolves to an array of Account objects.
  */
  async getAccounts(params: GetAccountsParams): Promise<Account[]> {
    const validatedParams = GetAccountsParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${this.#walletType}/accounts`, validatedParams);
    return response.map(convertToAccount);
  }


  /**
 * Get open orders.
 * @param {FetchOrdersParams} params - The parameters for fetching open orders.
 * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
 */
  async getOpenOrders(params: FetchOrdersParams): Promise<Order[]> {
    const validatedParams = FetchOrdersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${this.#walletType}/orders/open`, validatedParams);
    return response.map(convertToOrder);
  }

  /**
   * Get closed orders.
   * @param {FetchOrdersParams} params - The parameters for fetching closed orders.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getClosedOrders(params: FetchOrdersParams): Promise<Order[]> {
    const validatedParams = FetchOrdersParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${this.#walletType}/orders/closed`, validatedParams);
    return response.map(convertToOrder);
  }

  /**
   * Get order history in ascending order from a specific from_id.
   * @param {GetOrderHistoryParams} params - The parameters for fetching order history.
   * @returns {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  async getOrderHistory(params: GetOrderHistoryParams): Promise<Order[]> {
    const validatedParams = GetOrderHistoryParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${this.#walletType}/orders/history`, validatedParams);
    return response.map(convertToOrder);
  }

  /**
   * Create sell/buy order.
   * @param {SubmitOrderParams} params - The parameters for submitting an order.
   * @returns {Promise<Order>} A promise that resolves to an Order object.
   */
  async submitOrder(params: SubmitOrderParams): Promise<Order> {
    const validatedParams = SubmitOrderParamsSchema.parse(params);
    const response = await this.#restHandler.post<any>(`/wallet/${this.#walletType}/order`, validatedParams);
    return convertToOrder(response);
  }

  /**
   * Cancel all your orders with given market and side in different wallet type.
   * @param {CancelAllOrdersParams} params - The parameters for cancelling all orders.
   * @returns {Promise<{ success: boolean }[]>} A promise that resolves to an array of objects indicating success for each cancelled order.
   */
  async cancelAllOrders(params: CancelAllOrdersParams): Promise<{ success: boolean }[]> {
    const validatedParams = CancelAllOrdersParamsSchema.parse(params);
    return this.#restHandler.delete<{ success: boolean }[]>(`/wallet/${this.#walletType}/orders`, validatedParams);
  }


  /**
  * Get executed trades.
  * @param {GetTradesParams} params - The parameters for fetching trades.
  * @returns {Promise<Trade[]>} A promise that resolves to an array of Trade objects.
  */
  async getTrades(params: GetTradesParams): Promise<Trade[]> {
    const validatedParams = GetTradesParamsSchema.parse(params);
    const response = await this.#restHandler.get<any[]>(`/wallet/${this.#walletType}/trades`, validatedParams);
    return response.map(convertToTrade);
  }
}
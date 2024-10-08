import Decimal from 'decimal.js/decimal.mjs';
import { MAXOptions } from '../types.js';
import { PriceVolume } from '../rest/types.js';

export interface ErrorResponse {
  e: string;
  E: string[];
  i: string;
  T: number;
  co?: string;
}

export interface Subscription {
  channel: string; // Possible values: "book", "trade", "kline", "ticker", "market_status", "pool_quota"
  market: string;
  depth?: number; // Possible values: 1, 5, 10, 20, 50
  resolution?: string; // Possible values: "1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"
}

export interface WebSocketAPIOptions extends MAXOptions{
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// Define event types
export interface WebSocketEvents {
  'open': void;
  'close': CloseEvent;
  'error': Error | { message: string; code: number | null; time: Date };
  'authenticated': { time: Date };
  '.subscribed': { subscriptions: Subscription[]; time: Date };
  '.unsubscribed': { subscriptions: Subscription[]; time: Date };
  'book.snapshot': OrderBookEvent;
  'book.update': OrderBookEvent;
  'trade.snapshot': TradeEvent;
  'trade.update': TradeEvent;
  'kline.snapshot': KlineEvent;
  'kline.update': KlineEvent;
  'ticker.snapshot': TickerEvent;
  'ticker.update': TickerEvent;
  'market_status.snapshot': MarketStatusEvent;
  'market_status.update': MarketStatusEvent;
  'pool_quota.snapshot': PoolQuotaEvent;
  'pool_quota.update': PoolQuotaEvent;
  'user.order.snapshot': UserOrderEvent;
  'user.order.update': UserOrderEvent;
  'user.mwallet.order.snapshot': UserOrderEvent;
  'user.mwallet.order.update': UserOrderEvent;
  'user.trade.snapshot': UserTradeEvent;
  'user.trade.update': UserTradeEvent;
  'user.mwallet.trade.snapshot': UserTradeEvent;
  'user.mwallet.trade.update': UserTradeEvent;
  'user.account.snapshot': UserAccountEvent;
  'user.account.update': UserAccountEvent;
  'user.mwallet.account.snapshot': UserAccountEvent;
  'user.mwallet.account.update': UserAccountEvent;
  'user.adRatio.snapshot': UserAdRatioEvent;
  'user.adRatio.update': UserAdRatioEvent;
  'user.borrowing.snapshot': UserBorrowingEvent;
  'user.borrowing.update': UserBorrowingEvent;
  'raw': any; // For raw message data
}

// Define event data types
export interface OrderBookEvent {
  market: string;
  bids: PriceVolume[];
  asks: PriceVolume[];
  time: Date;
  firstUpdateId: number;
  lastUpdateId: number;
  version: number;
}

export interface Trade {
  price: Decimal;
  volume: Decimal;
  side: string; // Possible values: "up", "down"
  createdAt: Date;
}

export interface TradeEvent {
  market: string;
  trades: Trade[];
  time: Date;
}

export interface KlineEvent {
  market: string;
  startTime: Date;
  endTime: Date;
  resolution: string; // Possible values: "1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  volume: Decimal;
  lastTradeId: number;
  closed: boolean;
  time: Date;
}

export interface TickerEvent {
  market: string;
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  vol: Decimal;
  volInBtc: Decimal;
  at: Date;
}

export interface MarketStatus {
  id: string;
  status: string; // Possible values: "active", "suspended", "cancel-only"
  baseUnit: string;
  baseUnitPrecision: number;
  minBaseAmount: Decimal;
  quoteUnit: string;
  quoteUnitPrecision: number;
  minQuoteAmount: Decimal;
  mWalletSupported: boolean;
}

export interface MarketStatusEvent {
  marketStatuses: MarketStatus[];
  time: Date;
}

export interface PoolQuotaEvent {
  currency: string;
  available: Decimal;
  updatedAt: Date;
  time: Date;
}

export interface Order {
  id: number;
  side: string; // Possible values: "bid", "ask"
  ordType: string; // Possible values: "limit", "market", "stop_limit", "stop_market", "post_only", "ioc_limit"
  price: Decimal | null;
  stopPrice: Decimal | null;
  avgPrice: Decimal;
  volume: Decimal;
  remainingVolume: Decimal;
  executedVolume: Decimal;
  state: string; // Possible values: "wait", "done", "cancel"
  market: string;
  tradesCount: number;
  createdAt: Date;
  updatedAt: Date;
  groupId: number | null;
  clientOid: string | null;
}

export interface UserOrderEvent {
  orders: Order[];
  time: Date;
}

export interface UserTrade {
  id: number;
  market: string;
  side: string; // Possible values: "bid", "ask"
  price: Decimal;
  volume: Decimal;
  fee: Decimal | null;
  feeCurrency: string;
  feeDiscounted: boolean;
  funds: Decimal;
  createdAt: Date;
  updatedAt: Date;
  maker: boolean;
  orderId: number;
}

export interface UserTradeEvent {
  trades: UserTrade[];
  time: Date;
}

export interface UserBalance {
  currency: string;
  available: Decimal;
  locked: Decimal;
  staked: Decimal | null;
  updatedAt: Date;
}

export interface UserAccountEvent {
  time: Date;
  balances: UserBalance[];
}

export interface IndexPrice {
  market: string;
  price: Decimal;
}

export interface UserAdRatioEvent {
  adRatio: Decimal;
  assetInUsdt: Decimal;
  debtInUsdt: Decimal;
  indexPrices: IndexPrice[];
  updatedAt: Date;
  time: Date;
}

export interface Debt {
  currency: string;
  debtPrincipal: Decimal;
  debtInterest: Decimal;
  updatedAt: Date;
}

export interface UserBorrowingEvent {
  time: Date;
  debts: Debt[];
}
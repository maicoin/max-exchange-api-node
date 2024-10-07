import Decimal from 'decimal.js/decimal.mjs';
import { MAXOptions } from '../types.js';


// export type FilterType = 'mwallet_order' | 'mwallet_trade' | 'mwallet_account' | 'ad_ratio' | 'borrowing' | 'order' | 'trade' | 'account';

export interface ErrorResponse {
  e: string;
  E: string[];
  i: string;
  T: number;
  co?: string;
}

export interface Subscription {
  channel: string;
  market: string;
  depth?: number;
  resolution?: string;
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


export interface PriceVolume {
  price: Decimal;
  volume: Decimal;
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

// done
export interface Trade {
  price: Decimal;
  volume: Decimal;
  side: string;
  createdAt: Date;
}

// done
export interface TradeEvent {
  market: string;
  trades: Trade[];
  time: Date;
}

// done
export interface KlineEvent {
  market: string;
  startTime: Date;
  endTime: Date;
  resolution: string; // TODO check
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  volume: Decimal;
  lastTradeId: number;
  closed: boolean;
  time: Date;
}

// done
export interface TickerEvent {
  market: string;
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  volume: Decimal;
  volumeInBTC: Decimal;
  time: Date;
}

// done
export interface MarketStatus {
  id: string;
  status: string;
  baseUnit: string;
  baseUnitPrecision: number;
  minBaseAmount: Decimal;
  quoteUnit: string;
  quoteUnitPrecision: number;
  minQuoteAmount: Decimal;
  mWalletSupported: boolean;
}

// done
export interface MarketStatusEvent {
  marketStatuses: MarketStatus[];
  time: Date;
}

// done
export interface PoolQuotaEvent {
  currency: string;
  available: Decimal;
  updatedAt: Date;
  time: Date;
}

// done
export interface Order {
  id: number;
  side: string;
  ordType: string;
  price: Decimal;
  stopPrice: Decimal;
  avgPrice: Decimal;
  volume: Decimal;
  remainingVolume: Decimal;
  executedVolume: Decimal;
  state: string;
  market: string;
  tradeCount: number;
  createdAt: Date;
  updatedAt: Date;
  groupId: number;
  clientOid: string;
  //wallet_type: string; 
}

// done
export interface UserOrderEvent {
  orders: Order[];
  time: Date;
}

// done
export interface UserTrade {
  id: number;
  market: string;
  side: string;
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


  // wallet_type: string;
  // self_trade_bid_fee: Decimal | null;
  // self_trade_bid_fee_currency: string | null;
  // self_trade_bid_fee_discounted: boolean | null;
  // self_trade_bid_order_id: number | null;
  // liquidity: string;

}

// done
export interface UserTradeEvent {
  trades: UserTrade[];
  time: Date;
}

// done
export interface UserBalance {
  currency: string;
  available: Decimal;
  locked: Decimal;
  staked: Decimal | null;
  updatedAt: Date;
}

// done
export interface UserAccountEvent {
  time: Date;
  balances: UserBalance[];
}

// done
export interface IndexPrice {
  market: string;
  price: Decimal;
}

// done
export interface UserAdRatioEvent {
  adRatio: Decimal;
  assetInUsdt: Decimal;
  debtInUsdt: Decimal;
  indexPrices: IndexPrice[];
  updatedAt: Date;
  time: Date;
}

// done
export interface Debt {
  currency: string;
  debtPrincipal: Decimal;
  debtInterest: Decimal;
  updatedAt: Date;
}

// done
export interface UserBorrowingEvent {
  time: Date;
  debts: Debt[];
}

import { Decimal } from 'decimal.js';

export interface IndexPrice {
  timestamp: Date;
  price: Decimal;
}

export interface FundSource {
  uuid: string;
  currency: string;
  networkProtocol: string | null;
  address: string;
  extraLabel: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface Trade {
  id: number;
  orderId: number;
  walletType: 'spot' | 'm';
  price: Decimal;
  volume: Decimal;
  funds: Decimal;
  market: string;
  marketName: string;
  side: 'bid' | 'ask' | 'self-trade';
  fee: Decimal | null;
  feeCurrency: string | null;
  feeDiscounted: boolean | null;
  selfTradeBidFee: Decimal | null | undefined; 
  selfTradeBidFeeCurrency: string | null | undefined;
  selfTradeBidFeeDiscounted: boolean | null | undefined;
  selfTradeBidOrderId: number | null | undefined; 
  liquidity: 'maker' | 'taker';
  createdAt: Date;
}

export interface Order {
  id: number;
  walletType: 'spot' | 'm';
  market: string;
  clientOid: string | null;
  groupId: number | null;
  side: 'buy' | 'sell';
  state: 'wait' | 'done' | 'cancel' | 'convert'; // Possible values: 'wait', 'done', 'cancel', 'convert'
  ordType: string;
  price: Decimal | null;
  stopPrice: Decimal | null;
  avgPrice: Decimal;
  volume: Decimal;
  remainingVolume: Decimal;
  executedVolume: Decimal;
  tradesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  currency: string;
  balance: Decimal;
  locked: Decimal;
  staked: Decimal | null;
  principal?: Decimal;
  interest?: Decimal;
}

export interface AdRatio {
  adRatio: Decimal;
  assetInUsdt: Decimal;
  debtInUsdt: Decimal;
}

export interface Debt {
  sn: string;
  currency: string;
  amount: Decimal;
  state: string; // ??
  createdAt: Date;
  interestRate: Decimal;
}

export interface BorrowingTransfer {
  sn: string;
  side: 'in' | 'out';
  currency: string;
  amount: Decimal;
  createdAt: Date;
  state: 'processing' | 'failed' | 'canceled' | 'done'; // Possible values: processing, failed, canceled, done
}

export interface ManualRepayment {
  currency: string;
  amount: Decimal;
  principal: Decimal;
  interest: Decimal;
  state: string;
  sn: string;
  createdAt: Date;
}

export interface Liquidation {
  sn: string;
  adRatio: Decimal;
  expectedAdRatio: Decimal;
  createdAt: Date;
  state: 'processing' | 'liquidated'; // Possible values: processing, liquidated
}

export interface Repayment {
  currency: string;
  amount: Decimal;
  principal: Decimal;
  interest: Decimal;
  sn: string;
  state: string; // ??
  createdAt: Date;
}

export interface ForcedLiquidation {
  market: string;
  type: 'sell' | 'buy';
  price: Decimal;
  volume: Decimal;
  fee: Decimal;
  feeCurrency: string;
  repayment: Repayment;
}

export interface LiquidationDetail extends Liquidation {
  repayments: Repayment[];
  liquidations: ForcedLiquidation[];
}

export interface Interest {
  currency: string;
  amount: Decimal;
  interestRate: Decimal;
  principal: Decimal;
  createdAt: Date;
}

export interface Market {
  id: string;
  status: 'suspended' | 'cancel-only' | 'active'; // Possible values: suspended, cancel-only, active
  baseUnit: string;
  baseUnitPrecision: number;
  minBaseAmount: Decimal;
  quoteUnit: string;
  quoteUnitPrecision: number;
  minQuoteAmount: Decimal;
  mWalletSupported: boolean;
}

export interface CurrencyNetwork {
  tokenContractAddress: string | null; // 
  precision: number;
  id: string;
  networkProtocol: string;
  depositConfirmations: number;
  withdrawalFee: Decimal;
  minWithdrawalAmount: Decimal;
  withdrawalEnabled: boolean;
  depositEnabled: boolean;
  needMemo: boolean;
}

export interface Staking {
  stakeFlag: boolean;
  unstakeFlag: boolean;
}

export interface Currency {
  currency: string;
  type: 'crypto' | 'fiat';
  precision: number;
  mWalletSupported: boolean;
  mWalletMortgageable: boolean;
  mWalletBorrowable: boolean;
  minBorrowAmount: Decimal | null;
  networks: CurrencyNetwork[];
  staking: Staking | null;
}

export interface Timestamp {
  timestamp: Date;
}

export interface PublicTrade {
  id: number;
  price: Decimal;
  volume: Decimal;
  funds: Decimal;
  market: string;
  side: 'bid' | 'ask';
  createdAt: Date;
}

export interface Ticker {
  market: string;
  at: Date;
  buy: Decimal;
  buyVol: Decimal | undefined;
  sell: Decimal;
  sellVol: Decimal | undefined;
  open: Decimal;
  low: Decimal;
  high: Decimal;
  last: Decimal;
  vol: Decimal;
  volInBtc: Decimal;
}

export interface Withdrawal {
  uuid: string;
  currency: string;
  networkProtocol: string | null;
  amount: Decimal;
  fee: Decimal;
  feeCurrency: string;
  toAddress: string;
  label: string;
  txid: string | null;
  createdAt: Date;
  state: 'processing' | 'failed' | 'canceled' | 'done' ; // Possible values: processing, failed, canceled, done
  transactionType: string;
}

export interface Deposit {
  uuid: string;
  currency: string;
  networkProtocol: string;
  amount: Decimal;
  toAddress: string;
  txid: string;
  createdAt: Date;
  confirmations: number;
  state: 'processing' | 'failed' | 'canceled' | 'done'; // Possible values: processing, failed, canceled, done
  stateReason: string;
}

export interface InternalTransfer {
  uuid: string;
  currency: string;
  amount: Decimal;
  createdAt: Date;
  from: string;
  to: string;
  state: 'processing' | 'failed' | 'canceled' | 'done'; // Possible values: processing, failed, canceled, done
}

export interface Reward {
  uuid: string;
  currency: string;
  amount: Decimal;
  createdAt: Date;
  type: string;
  note: string;
}

export interface VipLevel {
  level: number;
  minimumTradingVolume: Decimal;
  minimumStakingVolume: Decimal;
  makerFee: Decimal;
  takerFee: Decimal;
}

export interface UserInfo {
  email: string;
  level: number;
  mWalletEnabled?: boolean;
  currentVipLevel: VipLevel;
  nextVipLevel: VipLevel | null;
}

export type BorrowingLimits = {
  [currency: string]: Decimal;
};

export type IndexPrices = {
  [currency: string]: Decimal;
};

// done
export type InterestRates = {
  hourlyInterestRate: Decimal;
  nextHourlyInterestRate: Decimal;
};

export type BorrowingInterestRates = {
  [currency: string]: InterestRates;
};

export interface PriceVolume {
  price: Decimal;
  volume: Decimal;
}

export interface Depth {
  timestamp: Date;
  lastUpdateVersion: number;
  lastUpdateId: number;
  asks: PriceVolume;
  bids: PriceVolume;
}

export interface IndexPrice {
  timestamp: string;
  price: string;
}

// done
export interface FundSource {
  uuid: string;
  currency: string;
  networkProtocol: string | null;
  address: string;
  extraLabel: string;
  createdAt: number;
  isInternal: boolean;
}

// done
export interface Trade {
  id: number;
  orderId: number;
  walletType: string;
  price: string;
  volume: string;
  funds: string;
  market: string;
  marketName: string;
  side: string;
  fee: string | null;
  feeCurrency: string | null;
  feeDiscounted: boolean | null;
  selfTradeBidFee: string | null;
  selfTradeBidFeeCurrency: string | null;
  selfTradeBidFeeDiscounted: boolean | null;
  selfTradeBidOrderId: number | null;
  liquidity: string;
  createdAt: number;
}

// done
export interface Order {
  id: number;
  walletType: string;
  market: string;
  clientOid: string | null;
  groupId: number | null;
  side: 'buy' | 'sell';
  state: string;
  ordType: string;
  price: string | null;
  stopPrice: string | null;
  avgPrice: string;
  volume: string;
  remainingVolume: string;
  executedVolume: string;
  tradesCount: number;
  createdAt: number;
  updatedAt: number;
}

// done
export interface Account {
  currency: string;
  balance: string;
  locked: string;
  staked: string | null;
  principal?: string;
  interest?: string;
}

// TODO check optional
export interface AdRatio {
  adRatio: string;
  assetInUsdt: string;
  debtInUsdt: string;
}

// done
export interface Debt {
  sn: string;
  currency: string;
  amount: string;
  state: string;
  createdAt: number;
  interestRate: string;
}

// done
export interface BorrowingTransfer {
  sn: string;
  side: string;
  currency: string;
  amount: string;
  createdAt: number;
  state: string;
}

// done
export interface ManualRepayment {
  currency: string;
  amount: string;
  principal: string;
  interest: string;
  state: string;
  sn: string;
  createdAt: number;
}

// done
export interface Liquidation {
  sn: string;
  adRatio: string;
  expectedAdRatio: string;
  createdAt: number;
  state: string;
}

// done
export interface LiquidationDetail extends Liquidation {
  repayments: Repayment[];
  liquidations: ForcedLiquidation[];
}

// done
export interface Repayment {
  currency: string;
  amount: string;
  principal: string;
  interest: string;
  state: string;
}

// done
export interface ForcedLiquidation {
  market: string;
  type: string;
  price: string;
  volume: string;
  fee: string;
  feeCurrency: string;
  repayment: Repayment;
}

// done
export interface Interest {
  currency: string;
  amount: string;
  interestRate: string;
  principal: string;
  createdAt: number;
}

// checked
export interface Market {
  id: string;
  status: string;
  baseUnit: string;
  baseUnitPrecision: number;
  minBaseAmount: number;
  quoteUnit: string;
  quoteUnitPrecision: number;
  minQuoteAmount: number;
  mWalletSupported: boolean;
}

// done
export interface Currency {
  currency: string;
  type: string;
  precision: number;
  mWalletSupported: boolean;
  mWalletMortgageable: boolean;
  mWalletBorrowable: boolean;
  minBorrowAmount: string;
  networks: CurrencyNetwork[];
  staking: Staking | null;
}

// TODO check null
export interface CurrencyNetwork {
  tokenContractAddress: string | null;
  precision: number;
  id: string;
  networkProtocol: string;
  depositConfirmations: number;
  withdrawalFee: number;
  minWithdrawalAmount: number;
  withdrawalEnabled: boolean;
  depositEnabled: boolean;
  needMemo: boolean;
}

// done
export interface Staking {
  stakeFlag: boolean;
  unstakeFlag: boolean;
}

export interface Timestamp {
  timestamp: number;
}

// TODO check null
export interface PublicTrade {
  id: number;
  price: string;
  volume: string;
  funds: string;
  market: string;
  side: 'bid' | 'ask';
  createdAt: number;
}

// done
export interface Ticker {
  market: string;
  at: number;
  buy: string;
  buyVol: string;
  sell: string;
  sellVol: string;
  open: string;
  low: string;
  high: string;
  last: string;
  vol: string;
  volInBtc: string;
}

// done
export interface Withdrawal {
  uuid: string;
  currency: string;
  networkProtocol: string | null;
  amount: string;
  fee: string;
  feeCurrency: string;
  toAddress: string;
  label: string;
  txid: string | null;
  createdAt: number;
  state: string;
  transactionType: string;
}

// TODO check optional
export interface Deposit {
  uuid: string;
  currency: string;
  networkProtocol: string;
  amount: string;
  toAddress: string;
  txid: string;
  createdAt: number;
  confirmations: number;
  state: string;
  stateReason: string;
}

// done
export interface InternalTransfer {
  uuid: string;
  currency: string;
  amount: string;
  createdAt: number;
  from: string;
  to: string;
  state: string;
}

// done
export interface Reward {
  uuid: string;
  currency: string;
  amount: string;
  createdAt: number;
  type: string;
  note: string;
}

// TODO check optional
export interface UserInfo {
  email: string;
  level: number;
  mWalletEnabled?: boolean;
  currentVipLevel: VipLevel;
  nextVipLevel: VipLevel | null;
}

// done
export interface VipLevel {
  level: number;
  minimumTradingVolume: number;
  minimumStakingVolume: number;
  makerFee: number;
  takerFee: number;
}

export type BorrowingLimits = {
  [currency: string]: string;
};

// done
export type InterestRates = {
  hourlyInterestRate: string;
  nextHourlyInterestRate: string;
};

// done
export type BorrowingInterestRates = {
  [currency: string]: InterestRates;
};

// done
export interface PriceLevel {
  price: string;
  amount: string;
}

// done
export interface Depth {
  timestamp: number;
  lastUpdateVersion: number;
  lastUpdateId: number;
  asks: PriceLevel[];
  bids: PriceLevel[];
}
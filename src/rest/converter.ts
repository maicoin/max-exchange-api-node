import { Decimal } from 'decimal.js';

import type {
  Account,
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
  Trade,
  UserInfo,
  Withdrawal,
  Depth,
  Repayment,
  ForcedLiquidation,
  VipLevel,
  CurrencyNetwork,
  IndexPrices,
  PriceVolume,
  DepositAddress,
} from './types.js';

export const convertToIndexPrice = (data: any): IndexPrice => ({
  timestamp: new Date(data.timestamp),
  price: new Decimal(data.price),
});

export const convertToMarket = (data: any): Market => ({
  ...data,
  minBaseAmount: new Decimal(data.minBaseAmount),
  minQuoteAmount: new Decimal(data.minQuoteAmount),
});

export const convertToCurrencyNetwork = (data: any): CurrencyNetwork => ({
  ...data,
  withdrawalFee: new Decimal(data.withdrawalFee),
  minWithdrawalAmount: new Decimal(data.minWithdrawalAmount),
});

export const convertToCurrency = (data: any): Currency => ({
  ...data,
  minBorrowAmount: data.minBorrowAmount === '' ? null : new Decimal(data.minBorrowAmount),
  networks: data.networks.map((d) => convertToCurrencyNetwork(d)),
});

export const convertToPriceVolume = ([price, amount]: [string, string]): PriceVolume => ({
  price: new Decimal(price),
  volume: new Decimal(amount),
});

export const convertToDepth = (data: any): Depth => ({
  timestamp: new Date(data.timestamp * 1000),
  lastUpdateVersion: data.lastUpdateVersion,
  lastUpdateId: data.lastUpdateId,
  asks: data.asks.map(convertToPriceVolume) as PriceVolume,
  bids: data.bids.map(convertToPriceVolume) as PriceVolume,
});

export const convertToPublicTrade = (data: any): PublicTrade => ({
  ...data,
  price: new Decimal(data.price),
  volume: new Decimal(data.volume),
  funds: new Decimal(data.funds),
  createdAt: new Date(data.createdAt),
});

export const convertToTicker = (data: any): Ticker => ({
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
  volInBtc: new Decimal(data.volInBtc),
});

export const convertToAccount = (data: any): Account => ({
  ...data,
  balance: new Decimal(data.balance),
  locked: new Decimal(data.locked),
  staked: data.staked ? new Decimal(data.staked) : null,
  principal: data.principal ? new Decimal(data.principal) : undefined,
  interest: data.interest ? new Decimal(data.interest) : undefined,
});

export const convertToAdRatio = (data: any): AdRatio => ({
  adRatio: new Decimal(data.adRatio),
  assetInUsdt: new Decimal(data.assetInUsdt),
  debtInUsdt: new Decimal(data.debtInUsdt),
});

export const convertToDebt = (data: any): Debt => ({
  ...data,
  amount: new Decimal(data.amount),
  createdAt: new Date(data.createdAt),
  interestRate: new Decimal(data.interestRate),
});

export const convertToManualRepayment = (data: any): ManualRepayment => ({
  ...data,
  amount: new Decimal(data.amount),
  principal: new Decimal(data.principal),
  interest: new Decimal(data.interest),
  createdAt: new Date(data.createdAt),
});

export const convertToLiquidation = (data: any): Liquidation => ({
  ...data,
  adRatio: new Decimal(data.adRatio),
  expectedAdRatio: new Decimal(data.expectedAdRatio),
  createdAt: new Date(data.createdAt),
});

export const convertToRepayment = (data: any): Repayment => ({
  ...data,
  amount: new Decimal(data.amount),
  principal: new Decimal(data.principal),
  interest: new Decimal(data.interest),
  createdAt: new Date(data.createdAt),
});

export const convertToForcedLiquidation = (data: any): ForcedLiquidation => ({
  ...data,
  price: new Decimal(data.price),
  volume: new Decimal(data.volume),
  fee: new Decimal(data.fee),
  repayment: convertToRepayment(data.repayment),
});

export const convertToLiquidationDetail = (data: any): LiquidationDetail => ({
  ...convertToLiquidation(data),
  repayments: data.repayments.map(convertToRepayment),
  liquidations: data.liquidations.map(convertToForcedLiquidation),
});

export const convertToInterest = (data: any): Interest => ({
  ...data,
  amount: new Decimal(data.amount),
  interestRate: new Decimal(data.interestRate),
  principal: new Decimal(data.principal),
  createdAt: new Date(data.createdAt),
});

export const convertToFundSource = (data: any): FundSource => ({
  ...data,
  createdAt: new Date(data.createdAt),
});

export const convertToOrder = (data: any): Order => ({
  ...data,
  price: data.price ? new Decimal(data.price) : null,
  stopPrice: data.stopPrice ? new Decimal(data.stopPrice) : null,
  avgPrice: new Decimal(data.avgPrice),
  volume: new Decimal(data.volume),
  remainingVolume: new Decimal(data.remainingVolume),
  executedVolume: new Decimal(data.executedVolume),
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
});

export const convertToTrade = (data: any): Trade => ({
  ...data,
  price: new Decimal(data.price),
  volume: new Decimal(data.volume),
  funds: new Decimal(data.funds),
  fee: data.fee ? new Decimal(data.fee) : null,
  selfTradeBidFee: data.selfTradeBidFee ? new Decimal(data.selfTradeBidFee) : null,
  createdAt: new Date(data.createdAt),
});

export const convertToBorrowingTransfer = (data: any): BorrowingTransfer => ({
  ...data,
  amount: new Decimal(data.amount),
  createdAt: new Date(data.createdAt),
});

export const convertToWithdrawal = (data: any): Withdrawal => ({
  ...data,
  amount: new Decimal(data.amount),
  fee: new Decimal(data.fee),
  createdAt: new Date(data.createdAt),
});

export const convertToDeposit = (data: any): Deposit => ({
  ...data,
  amount: new Decimal(data.amount),
  createdAt: new Date(data.createdAt),
});

export const convertToInternalTransfer = (data: any): InternalTransfer => ({
  ...data,
  amount: new Decimal(data.amount),
  createdAt: new Date(data.createdAt),
});

export const convertToReward = (data: any): Reward => ({
  ...data,
  amount: new Decimal(data.amount),
  createdAt: new Date(data.createdAt),
});

export const convertToVipLevel = (data: any): VipLevel => ({
  ...data,
  minimumTradingVolume: new Decimal(data.minimumTradingVolume),
  minimumStakingVolume: new Decimal(data.minimumStakingVolume),
  makerFee: new Decimal(data.makerFee),
  takerFee: new Decimal(data.takerFee),
});

export const convertToUserInfo = (data: any): UserInfo => ({
  ...data,
  currentVipLevel: convertToVipLevel(data.currentVipLevel),
  nextVipLevel: data.nextVipLevel ? convertToVipLevel(data.nextVipLevel) : null,
});

export const convertToInterestRate = (
  data: Record<string, { hourlyInterestRate: string; nextHourlyInterestRate: string }>
): BorrowingInterestRates =>
  Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = {
      hourlyInterestRate: new Decimal(value.hourlyInterestRate),
      nextHourlyInterestRate: new Decimal(value.nextHourlyInterestRate),
    };
    return acc;
  }, {} as BorrowingInterestRates);

export const convertToKLine = (
  data: [number, string, string, string, string, string][]
): [Date, Decimal, Decimal, Decimal, Decimal, Decimal][] =>
  data.map(([timestamp, open, high, low, close, volume]) => [
    new Date(timestamp * 1000),
    new Decimal(open),
    new Decimal(high),
    new Decimal(low),
    new Decimal(close),
    new Decimal(volume),
  ]);

export const convertToBorrowingLimits = (data: Record<string, string>): BorrowingLimits =>
  Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = new Decimal(value);
    return acc;
  }, {} as BorrowingLimits);

export const convertToIndexPrices = (data: Record<string, string>): IndexPrices =>
  Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = new Decimal(value);
    return acc;
  }, {} as IndexPrices);

export function convertToDepositAddress(data: any): DepositAddress {
  return {
    currency: data.currency,
    networkProtocol: data.networkProtocol,
    currencyVersion: data.currencyVersion,
    address: data.address
  };
}  
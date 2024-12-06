import { z } from 'zod';

// Define Zod schemas for common types
export const WalletTypeSchema = z.enum(['spot', 'm']);
export const OrderBySchema = z.enum(['asc', 'desc', 'asc_updated_at', 'desc_updated_at']);
export const SideSchema = z.enum(['in', 'out']);
export const StateSchema = z.enum(['processing', 'failed', 'canceled', 'done']);

// Define type aliases
export type WalletType = z.infer<typeof WalletTypeSchema>;
export type OrderBy = z.infer<typeof OrderBySchema>;
export type Side = z.infer<typeof SideSchema>;
export type State = z.infer<typeof StateSchema>;

export const FetchOrdersParamsSchema = z.object({
  market: z.string(),
  timestamp: z.number().optional(),
  orderBy: OrderBySchema.optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type FetchOrdersParams = z.infer<typeof FetchOrdersParamsSchema>;

export const HistoricalIndexPricesParamsSchema = z.object({
  market: z.string(),
  startTime: z.number().min(1512950400000).max(4102444800000),
  endTime: z.number().min(1512950400000).max(4102444800000),
});
export type HistoricalIndexPricesParams = z.infer<typeof HistoricalIndexPricesParamsSchema>;

export const GetTradesParamsSchema = z.object({
  market: z.string().optional(),
  timestamp: z.number().optional(),
  fromId: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetTradesParams = z.infer<typeof GetTradesParamsSchema>;

export const GetAccountsParamsSchema = z.object({
  currency: z.string().optional(),
});
export type GetAccountsParams = z.infer<typeof GetAccountsParamsSchema>;

export const SubmitLoanParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
});
export type SubmitLoanParams = z.infer<typeof SubmitLoanParamsSchema>;

export const GetOrderHistoryParamsSchema = z.object({
  market: z.string(),
  fromId: z.number().optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetOrderHistoryParams = z.infer<typeof GetOrderHistoryParamsSchema>;

export const GetLoansParamsSchema = z.object({
  currency: z.string(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetLoansParams = z.infer<typeof GetLoansParamsSchema>;

export const TransferBetweenWalletsParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
  side: SideSchema,
});
export type TransferBetweenWalletsParams = z.infer<typeof TransferBetweenWalletsParamsSchema>;

export const GetTransfersParamsSchema = z.object({
  currency: z.string(),
  side: SideSchema,
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetTransfersParams = z.infer<typeof GetTransfersParamsSchema>;

export const SubmitRepaymentParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
});
export type SubmitRepaymentParams = z.infer<typeof SubmitRepaymentParamsSchema>;

export const GetRepaymentsParamsSchema = z.object({
  currency: z.string(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetRepaymentsParams = z.infer<typeof GetRepaymentsParamsSchema>;

export const GetLiquidationsParamsSchema = z.object({
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetLiquidationsParams = z.infer<typeof GetLiquidationsParamsSchema>;

export const GetLiquidationDetailParamsSchema = z.object({
  sn: z.string(),
});
export type GetLiquidationDetailParams = z.infer<typeof GetLiquidationDetailParamsSchema>;

export const GetInterestsParamsSchema = z.object({
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetInterestsParams = z.infer<typeof GetInterestsParamsSchema>;

export const GetKLineParamsSchema = z.object({
  market: z.string(),
  limit: z.number().min(1).max(10000).optional(),
  period: z.number().optional(),
  timestamp: z.number().optional(),
});
export type GetKLineParams = z.infer<typeof GetKLineParamsSchema>;

export const GetDepthParamsSchema = z.object({
  market: z.string(),
  limit: z.number().min(1).max(300).optional(),
  sortByPrice: z.boolean().optional(),
});
export type GetDepthParams = z.infer<typeof GetDepthParamsSchema>;

export const GetPublicTradesParamsSchema = z.object({
  market: z.string(),
  timestamp: z.number().optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetPublicTradesParams = z.infer<typeof GetPublicTradesParamsSchema>;

export const GetTickersParamsSchema = z.object({
  markets: z.array(z.string()),
});
export type GetTickersParams = z.infer<typeof GetTickersParamsSchema>;

export const GetTickerParamsSchema = z.object({
  market: z.string(),
});
export type GetTickerParams = z.infer<typeof GetTickerParamsSchema>;

export const GetOrderTradesParamsSchema = z.object({
  orderId: z.number().optional(),
  clientOid: z.string().optional(),
});
export type GetOrderTradesParams = z.infer<typeof GetOrderTradesParamsSchema>;

export const GetOrderParamsSchema = z.object({
  id: z.number().optional(),
  clientOid: z.string().optional(),
});
export type GetOrderParams = z.infer<typeof GetOrderParamsSchema>;

export const CancelOrderParamsSchema = z.object({
  id: z.number().optional(),
  clientOid: z.string().optional(),
});
export type CancelOrderParams = z.infer<typeof CancelOrderParamsSchema>;

export const GetWithdrawalParamsSchema = z.object({
  uuid: z.string(),
});
export type GetWithdrawalParams = z.infer<typeof GetWithdrawalParamsSchema>;

export const SubmitWithdrawalParamsSchema = z.object({
  withdrawAddressUuid: z.string(),
  amount: z.string(),
});
export type SubmitWithdrawalParams = z.infer<typeof SubmitWithdrawalParamsSchema>;

export const SubmitTWDWithdrawalParamsSchema = z.object({
  amount: z.string(),
});
export type SubmitTWDWithdrawalParams = z.infer<typeof SubmitTWDWithdrawalParamsSchema>;

export const GetWithdrawalsParamsSchema = z.object({
  currency: z.string().optional(),
  state: StateSchema.optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetWithdrawalsParams = z.infer<typeof GetWithdrawalsParamsSchema>;

export const GetWithdrawAddressesParamsSchema = z.object({
  currency: z.string(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().optional(),
});
export type GetWithdrawAddressesParams = z.infer<typeof GetWithdrawAddressesParamsSchema>;

export const GetDepositParamsSchema = z.object({
  txid: z.string().optional(),
  uuid: z.string().optional(),
});
export type GetDepositParams = z.infer<typeof GetDepositParamsSchema>;

export const GetDepositsParamsSchema = z.object({
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetDepositsParams = z.infer<typeof GetDepositsParamsSchema>;

export const GetInternalTransfersParamsSchema = z.object({
  side: SideSchema,
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetInternalTransfersParams = z.infer<typeof GetInternalTransfersParamsSchema>;

export const GetRewardsParamsSchema = z.object({
  rewardType: z
    .enum([
      'vip_rebate',
      'staking_reward',
      'redemption_reward',
      'commission',
      'airdrop_reward',
      'trading_reward',
      'mining_reward',
      'holding_reward',
      'yield',
    ])
    .optional(),
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});
export type GetRewardsParams = z.infer<typeof GetRewardsParamsSchema>;

export const SubmitOrderParamsSchema = z.object({
  market: z.string(),
  side: z.enum(['sell', 'buy']),
  volume: z.string(),
  price: z.string().optional(),
  clientOid: z.string().optional(),
  stop_price: z.string().optional(),
  ord_type: z.enum(['market', 'limit', 'stopMarket', 'stopLimit', 'postOnly', 'iocLimit']).optional(),
  group_id: z.number().optional(),
});
export type SubmitOrderParams = z.infer<typeof SubmitOrderParamsSchema>;

export const CancelAllOrdersParamsSchema = z.object({
  market: z.string().optional(),
  side: z.enum(['sell', 'buy']).optional(),
  group_id: z.number().optional(),
});
export type CancelAllOrdersParams = z.infer<typeof CancelAllOrdersParamsSchema>;


export const GetDepositAddressParamsSchema = z.object({
  currency_version: z.string(),
});

export type GetDepositAddressParams = z.infer<typeof GetDepositAddressParamsSchema>;

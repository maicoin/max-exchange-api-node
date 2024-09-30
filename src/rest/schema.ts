import { z } from 'zod';

// Define Zod schemas for common types
export const WalletTypeSchema = z.enum(['spot', 'm']);
export const OrderBySchema = z.enum(['asc', 'desc', 'asc_updated_at', 'desc_updated_at']);
export const SideSchema = z.enum(['in', 'out']);
export const StateSchema = z.enum(['processing', 'failed', 'canceled', 'done']);

// Define type aliases
export type WalletType = z.infer<typeof WalletTypeSchema>;
// type OrderBy = z.infer<typeof OrderBySchema>;
// type Side = z.infer<typeof SideSchema>;
// type State = z.infer<typeof StateSchema>;

export const FetchOrdersParamsSchema = z.object({
  market: z.string(),
  timestamp: z.number().optional(),
  orderBy: OrderBySchema.optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const HistoricalIndexPricesParamsSchema = z.object({
  market: z.string(),
  startTime: z.number().min(1512950400000).max(4102444800000),
  endTime: z.number().min(1512950400000).max(4102444800000),
});

export const GetTradesParamsSchema = z.object({
  market: z.string().optional(),
  timestamp: z.number().optional(),
  fromId: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetAccountsParamsSchema = z.object({
  currency: z.string().optional(),
});

export const SubmitLoanParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
});

export const GetOrderHistoryParamsSchema = z.object({
  market: z.string(),
  fromId: z.number().optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetLoansParamsSchema = z.object({
  currency: z.string(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const TransferBetweenWalletsParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
  side: SideSchema,
});

export const GetTransfersParamsSchema = z.object({
  currency: z.string(),
  side: SideSchema,
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const SubmitRepaymentParamsSchema = z.object({
  currency: z.string(),
  amount: z.string(),
});

export const GetRepaymentsParamsSchema = z.object({
  currency: z.string(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetLiquidationsParamsSchema = z.object({
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetLiquidationDetailParamsSchema = z.object({
  sn: z.string(),
});

export const GetInterestsParamsSchema = z.object({
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetKLineParamsSchema = z.object({
  market: z.string(),
  limit: z.number().min(1).max(10000).optional(),
  period: z.number().optional(),
  timestamp: z.number().optional(),
});

export const GetDepthParamsSchema = z.object({
  market: z.string(),
  limit: z.number().min(1).max(300).optional(),
  sortByPrice: z.boolean().optional(),
});

export const GetPublicTradesParamsSchema = z.object({
  market: z.string(),
  timestamp: z.number().optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetTickersParamsSchema = z.object({
  markets: z.array(z.string()),
});

export const GetTickerParamsSchema = z.object({
  market: z.string(),
});

export const GetOrderTradesParamsSchema = z.object({
  orderId: z.number().optional(),
  clientOid: z.string().optional(),
});

export const GetOrderParamsSchema = z.object({
  id: z.number().optional(),
  clientOid: z.string().optional(),
});

export const CancelOrderParamsSchema = z.object({
  id: z.number().optional(),
  clientOid: z.string().optional(),
});

export const GetWithdrawalParamsSchema = z.object({
  uuid: z.string(),
});

export const SubmitWithdrawalParamsSchema = z.object({
  withdrawAddressUuid: z.string(),
  amount: z.string(),
});

export const SubmitTWDWithdrawalParamsSchema = z.object({
  amount: z.string(),
});

export const GetWithdrawalsParamsSchema = z.object({
  currency: z.string().optional(),
  state: StateSchema.optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetWithdrawAddressesParamsSchema = z.object({
  currency: z.string(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().optional(),
});

export const GetDepositParamsSchema = z.object({
  txid: z.string().optional(),
  uuid: z.string().optional(),
});

export const GetDepositsParamsSchema = z.object({
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetInternalTransfersParamsSchema = z.object({
  side: SideSchema,
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const GetRewardsParamsSchema = z.object({
  rewardType: z.string().optional(),
  currency: z.string().optional(),
  timestamp: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(1000).optional(),
});

export const SubmitOrderParamsSchema = z.object({
  market: z.string(),
  side: z.enum(['sell', 'buy']),
  volume: z.string(),
  price: z.string().optional(),
  clientOid: z.string().optional(),
  stop_price: z.string().optional(),
  ord_type: z.enum(['market', 'limit', 'stopMarket', 'stopLimit', 'postOnly', 'iocLimit']).optional(), // TODO enum body
  group_id: z.number().optional(),
});

export const CancelAllOrdersParamsSchema = z.object({
  market: z.string().optional(),
  side: z.enum(['sell', 'buy']).optional(),
  group_id: z.number().optional(),
});

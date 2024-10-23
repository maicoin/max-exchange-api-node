import { z } from 'zod';

export const ChannelSchema = z.enum(['book', 'trade', 'kline', 'ticker', 'market_status', 'pool_quota', 'user']);

export const SubscriptionOptionsSchema = z.object({
  depth: z.number().int().refine(val => [1, 5, 10, 20, 50].includes(val), {
    message: 'Depth must be one of 1, 5, 10, 20, or 50'
  }).optional(),
  resolution: z.enum(['1m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d']).optional(),
});
export const SubscriptionSchema = z
  .object({
    channel: ChannelSchema,
    market: z.string().min(1),
  })
  .merge(SubscriptionOptionsSchema);

export type SubscriptionOptionalParam = z.infer<typeof SubscriptionOptionsSchema>;

export const FilterTypeSchema = z.enum([
  'mwallet_order',
  'mwallet_trade',
  'mwallet_account',
  'ad_ratio',
  'borrowing',
  'order',
  'trade',
  'account',
]);
export type FilterType = z.infer<typeof FilterTypeSchema>;

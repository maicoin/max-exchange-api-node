import { z } from 'zod';

export const ChannelSchema = z.enum(['book', 'trade', 'kline', 'ticker', 'market_status', 'pool_quota', 'user']);

export const SubscriptionOptionsSchema = z.object({
    depth: z.number().int().positive().optional(),
    resolution: z.string().optional(),
  });
  
  export const SubscriptionSchema = z.object({
    channel: ChannelSchema,
    market: z.string().min(1),
  }).merge(SubscriptionOptionsSchema);

export type SubscriptionOptionalParam = z.infer<typeof SubscriptionOptionsSchema>


export const FilterTypeSchema = z.enum(['mwallet_order' , 'mwallet_trade' , 'mwallet_account' , 'ad_ratio' , 'borrowing' , 'order' , 'trade' , 'account']);
export type FilterType = z.infer<typeof FilterTypeSchema>;
[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / GetRewardsParamsSchema

# Variable: GetRewardsParamsSchema

> `const` **GetRewardsParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### currency

> **currency**: `ZodOptional`\<`ZodString`\>

### limit

> **limit**: `ZodOptional`\<`ZodNumber`\>

### order

> **order**: `ZodOptional`\<`ZodEnum`\<[`"asc"`, `"desc"`]\>\>

### rewardType

> **rewardType**: `ZodOptional`\<`ZodEnum`\<[`"vip_rebate"`, `"staking_reward"`, `"redemption_reward"`, `"commission"`, `"airdrop_reward"`, `"trading_reward"`, `"mining_reward"`, `"holding_reward"`, `"yield"`]\>\>

### timestamp

> **timestamp**: `ZodOptional`\<`ZodNumber`\>

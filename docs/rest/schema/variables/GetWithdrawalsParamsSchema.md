[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / GetWithdrawalsParamsSchema

# Variable: GetWithdrawalsParamsSchema

> `const` **GetWithdrawalsParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### currency

> **currency**: `ZodOptional`\<`ZodString`\>

### limit

> **limit**: `ZodOptional`\<`ZodNumber`\>

### order

> **order**: `ZodOptional`\<`ZodEnum`\<[`"asc"`, `"desc"`]\>\>

### state

> **state**: `ZodOptional`\<`ZodEnum`\<[`"processing"`, `"failed"`, `"canceled"`, `"done"`]\>\>

### timestamp

> **timestamp**: `ZodOptional`\<`ZodNumber`\>

[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / GetRepaymentsParamsSchema

# Variable: GetRepaymentsParamsSchema

> `const` **GetRepaymentsParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### currency

> **currency**: `ZodString`

### limit

> **limit**: `ZodOptional`\<`ZodNumber`\>

### order

> **order**: `ZodOptional`\<`ZodEnum`\<[`"asc"`, `"desc"`]\>\>

### timestamp

> **timestamp**: `ZodOptional`\<`ZodNumber`\>

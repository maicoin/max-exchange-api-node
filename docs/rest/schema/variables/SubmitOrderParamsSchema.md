[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / SubmitOrderParamsSchema

# Variable: SubmitOrderParamsSchema

> `const` **SubmitOrderParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### clientOid

> **clientOid**: `ZodOptional`\<`ZodString`\>

### group\_id

> **group\_id**: `ZodOptional`\<`ZodNumber`\>

### market

> **market**: `ZodString`

### ord\_type

> **ord\_type**: `ZodOptional`\<`ZodEnum`\<[`"market"`, `"limit"`, `"stopMarket"`, `"stopLimit"`, `"postOnly"`, `"iocLimit"`]\>\>

### price

> **price**: `ZodOptional`\<`ZodString`\>

### side

> **side**: `ZodEnum`\<[`"sell"`, `"buy"`]\>

### stop\_price

> **stop\_price**: `ZodOptional`\<`ZodString`\>

### volume

> **volume**: `ZodString`

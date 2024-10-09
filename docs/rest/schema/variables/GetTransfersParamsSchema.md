[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / GetTransfersParamsSchema

# Variable: GetTransfersParamsSchema

> `const` **GetTransfersParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### currency

> **currency**: `ZodString`

### limit

> **limit**: `ZodOptional`\<`ZodNumber`\>

### order

> **order**: `ZodOptional`\<`ZodEnum`\<[`"asc"`, `"desc"`]\>\>

### side

> **side**: `ZodEnum`\<[`"in"`, `"out"`]\> = `SideSchema`

### timestamp

> **timestamp**: `ZodOptional`\<`ZodNumber`\>

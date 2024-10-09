[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/schema](../README.md) / FetchOrdersParamsSchema

# Variable: FetchOrdersParamsSchema

> `const` **FetchOrdersParamsSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### limit

> **limit**: `ZodOptional`\<`ZodNumber`\>

### market

> **market**: `ZodString`

### orderBy

> **orderBy**: `ZodOptional`\<`ZodEnum`\<[`"asc"`, `"desc"`, `"asc_updated_at"`, `"desc_updated_at"`]\>\>

### timestamp

> **timestamp**: `ZodOptional`\<`ZodNumber`\>

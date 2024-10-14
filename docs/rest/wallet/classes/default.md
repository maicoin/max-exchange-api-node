[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [rest/wallet](../README.md) / default

# Class: default

## Constructors

### new default()

> **new default**(`restHandler`, `walletType`): [`default`](default.md)

#### Parameters

• **restHandler**: `RestHandler`

• **walletType**: `"spot"` \| `"m"`

#### Returns

[`default`](default.md)

## Methods

### cancelAllOrders()

> **cancelAllOrders**(`params`): `Promise`\<`object`[]\>

Cancel all your orders with given market and side in different wallet type.

#### Parameters

• **params**

The parameters for cancelling all orders.

• **params.group\_id?**: `number` = `...`

• **params.market?**: `string` = `...`

• **params.side?**: `"buy"` \| `"sell"` = `...`

#### Returns

`Promise`\<`object`[]\>

A promise that resolves to an array of objects indicating success for each cancelled order.

***

### getAccounts()

> **getAccounts**(`params`): `Promise`\<[`Account`](../../types/interfaces/Account.md)[]\>

Get your account balance with all supported currencies by different wallet type.

#### Parameters

• **params**

The parameters for fetching account balances.

• **params.currency?**: `string` = `...`

#### Returns

`Promise`\<[`Account`](../../types/interfaces/Account.md)[]\>

A promise that resolves to an array of Account objects.

***

### getClosedOrders()

> **getClosedOrders**(`params`): `Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

Get closed orders.

#### Parameters

• **params**

The parameters for fetching closed orders.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.orderBy?**: `"asc"` \| `"desc"` \| `"asc_updated_at"` \| `"desc_updated_at"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getOpenOrders()

> **getOpenOrders**(`params`): `Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

Get open orders.

#### Parameters

• **params**

The parameters for fetching open orders.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.orderBy?**: `"asc"` \| `"desc"` \| `"asc_updated_at"` \| `"desc_updated_at"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getOrderHistory()

> **getOrderHistory**(`params`): `Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

Get order history in ascending order from a specific from_id.

#### Parameters

• **params**

The parameters for fetching order history.

• **params.fromId?**: `number` = `...`

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

#### Returns

`Promise`\<[`Order`](../../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getTrades()

> **getTrades**(`params`): `Promise`\<[`Trade`](../../types/interfaces/Trade.md)[]\>

Get executed trades.

#### Parameters

• **params**

The parameters for fetching trades.

• **params.fromId?**: `number` = `...`

• **params.limit?**: `number` = `...`

• **params.market?**: `string` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Trade`](../../types/interfaces/Trade.md)[]\>

A promise that resolves to an array of Trade objects.

***

### submitOrder()

> **submitOrder**(`params`): `Promise`\<[`Order`](../../types/interfaces/Order.md)\>

Create sell/buy order.

#### Parameters

• **params**

The parameters for submitting an order.

• **params.clientOid?**: `string` = `...`

• **params.group\_id?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.ord\_type?**: `"market"` \| `"limit"` \| `"stopMarket"` \| `"stopLimit"` \| `"postOnly"` \| `"iocLimit"` = `...`

• **params.price?**: `string` = `...`

• **params.side**: `"buy"` \| `"sell"` = `...`

• **params.stop\_price?**: `string` = `...`

• **params.volume**: `string` = `...`

#### Returns

`Promise`\<[`Order`](../../types/interfaces/Order.md)\>

A promise that resolves to an Order object.

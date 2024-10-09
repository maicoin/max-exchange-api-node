[**max-exchange-api-node**](../../README.md) • **Docs**

***

[max-exchange-api-node](../../modules.md) / [index](../README.md) / WebSocketBook

# Class: WebSocketBook

## Extends

- `default`

## Constructors

### new WebSocketBook()

> **new WebSocketBook**(`ws`, `market`, `depth`): [`WebSocketBook`](WebSocketBook.md)

#### Parameters

• **ws**: [`default`](../../ws/classes/default.md)

• **market**: `string`

• **depth**: `undefined` \| `number` = `undefined`

#### Returns

[`WebSocketBook`](WebSocketBook.md)

#### Overrides

`Book.constructor`

## Methods

### bestAsk()

> **bestAsk**(): `null` \| [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)

#### Returns

`null` \| [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)

#### Inherited from

`Book.bestAsk`

***

### bestBid()

> **bestBid**(): `null` \| [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)

#### Returns

`null` \| [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)

#### Inherited from

`Book.bestBid`

***

### handleSnapshot()

> **handleSnapshot**(`e`): `void`

#### Parameters

• **e**: [`OrderBookEvent`](../../ws/types/interfaces/OrderBookEvent.md)

#### Returns

`void`

***

### handleUpdate()

> **handleUpdate**(`e`): `void`

#### Parameters

• **e**: [`OrderBookEvent`](../../ws/types/interfaces/OrderBookEvent.md)

#### Returns

`void`

***

### load()

> **load**(`snapshot`): `void`

#### Parameters

• **snapshot**

• **snapshot.asks**: [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)[]

• **snapshot.bids**: [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)[]

#### Returns

`void`

#### Inherited from

`Book.load`

***

### onUpdate()

> **onUpdate**(`cb`): `void`

#### Parameters

• **cb**

#### Returns

`void`

***

### pretty()

> **pretty**(): `void`

#### Returns

`void`

#### Inherited from

`Book.pretty`

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Inherited from

`Book.reset`

***

### spread()

> **spread**(): `number`

#### Returns

`number`

#### Inherited from

`Book.spread`

***

### update()

> **update**(`update`): `void`

#### Parameters

• **update**

• **update.asks**: [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)[]

• **update.bids**: [`PriceVolume`](../../rest/types/interfaces/PriceVolume.md)[]

#### Returns

`void`

#### Inherited from

`Book.update`

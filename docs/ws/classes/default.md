[**max-exchange-api-node**](../../README.md) • **Docs**

***

[max-exchange-api-node](../../modules.md) / [ws](../README.md) / default

# Class: default

## Extends

- `EventEmitter`

## Constructors

### new default()

> **new default**(`options`): [`default`](default.md)

Create a new WebSocketAPI instance.

#### Parameters

• **options**: [`WebSocketAPIOptions`](../types/interfaces/WebSocketAPIOptions.md)

The options for the WebSocket API.

#### Returns

[`default`](default.md)

#### Overrides

`EventEmitter.constructor`

## Methods

### connect()

> **connect**(): `void`

Establish a connection to the WebSocket server.

#### Returns

`void`

***

### disconnect()

> **disconnect**(): `void`

Disconnect from the WebSocket server.

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`eventName`, `value`): `boolean`

Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Type Parameters

• **K** *extends* keyof [`WebSocketEvents`](../types/interfaces/WebSocketEvents.md)

#### Parameters

• **eventName**: `K`

• **value**: [`WebSocketEvents`](../types/interfaces/WebSocketEvents.md)\[`K`\]

#### Returns

`boolean`

#### Since

v0.1.26

#### Overrides

`EventEmitter.emit`

***

### getConnectionState()

> **getConnectionState**(): `number`

Get the current connection state.

#### Returns

`number`

The current WebSocket connection state.

***

### on()

> **on**\<`K`\>(`eventName`, `listener`): `this`

Adds the `listener` function to the end of the listeners array for the event
named `eventName`. No checks are made to see if the `listener` has already
been added. Multiple calls passing the same combination of `eventName` and
`listener` will result in the `listener` being added, and called, multiple times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The `emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

• **K** *extends* keyof [`WebSocketEvents`](../types/interfaces/WebSocketEvents.md)

#### Parameters

• **eventName**: `K`

The name of the event.

• **listener**

The callback function

#### Returns

`this`

#### Since

v0.1.101

#### Overrides

`EventEmitter.on`

***

### setFilters()

> **setFilters**(`filters`): `void`

Set filters for private channel subscriptions.

#### Parameters

• **filters**: (`"order"` \| `"trade"` \| `"mwallet_order"` \| `"mwallet_trade"` \| `"mwallet_account"` \| `"ad_ratio"` \| `"borrowing"` \| `"account"`)[]

An array of filter types to apply.

#### Returns

`void`

***

### subscribe()

> **subscribe**(`channel`, `market`, `options`): `void`

Subscribe to a specific channel for a given market.

#### Parameters

• **channel**: `"book"` \| `"trade"` \| `"kline"` \| `"ticker"` \| `"market_status"` \| `"pool_quota"` \| `"user"`

The channel to subscribe to ('book', 'trade', 'kline', 'ticker', 'market_status', 'pool_quota', or 'user').

• **market**: `string`

The market to subscribe to.

• **options** = `{}`

Additional options for the subscription.

• **options.depth?**: `number` = `...`

• **options.resolution?**: `"1m"` \| `"5m"` \| `"15m"` \| `"30m"` \| `"1h"` \| `"2h"` \| `"4h"` \| `"6h"` \| `"12h"` \| `"1d"` = `...`

#### Returns

`void`

***

### unsubscribe()

> **unsubscribe**(`channel`, `market`, `options`): `void`

Unsubscribe from a specific channel for a given market.

#### Parameters

• **channel**: `"book"` \| `"trade"` \| `"kline"` \| `"ticker"` \| `"market_status"` \| `"pool_quota"` \| `"user"`

The channel to unsubscribe from.

• **market**: `string`

The market to unsubscribe from.

• **options** = `{}`

Additional options for the unsubscription.

• **options.depth?**: `number` = `...`

• **options.resolution?**: `"1m"` \| `"5m"` \| `"15m"` \| `"30m"` \| `"1h"` \| `"2h"` \| `"4h"` \| `"6h"` \| `"12h"` \| `"1d"` = `...`

#### Returns

`void`

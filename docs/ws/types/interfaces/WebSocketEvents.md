[**max-exchange-api-node**](../../../README.md) • **Docs**

***

[max-exchange-api-node](../../../modules.md) / [ws/types](../README.md) / WebSocketEvents

# Interface: WebSocketEvents

## Properties

### .subscribed

> **subscribed**: `object`

#### subscriptions

> **subscriptions**: `object`[]

#### time

> **time**: `Date`

***

### .unsubscribed

> **unsubscribed**: `object`

#### subscriptions

> **subscriptions**: `object`[]

#### time

> **time**: `Date`

***

### authenticated

> **authenticated**: `object`

#### time

> **time**: `Date`

***

### book.snapshot

> **snapshot**: [`OrderBookEvent`](OrderBookEvent.md)

***

### book.update

> **update**: [`OrderBookEvent`](OrderBookEvent.md)

***

### close

> **close**: `CloseEvent`

***

### error

> **error**: `Error` \| `object`

***

### kline.snapshot

> **snapshot**: [`KlineEvent`](KlineEvent.md)

***

### kline.update

> **update**: [`KlineEvent`](KlineEvent.md)

***

### market\_status.snapshot

> **snapshot**: [`MarketStatusEvent`](MarketStatusEvent.md)

***

### market\_status.update

> **update**: [`MarketStatusEvent`](MarketStatusEvent.md)

***

### open

> **open**: `void`

***

### pool\_quota.snapshot

> **snapshot**: [`PoolQuotaEvent`](PoolQuotaEvent.md)

***

### pool\_quota.update

> **update**: [`PoolQuotaEvent`](PoolQuotaEvent.md)

***

### raw

> **raw**: `any`

***

### ticker.snapshot

> **snapshot**: [`TickerEvent`](TickerEvent.md)

***

### ticker.update

> **update**: [`TickerEvent`](TickerEvent.md)

***

### trade.snapshot

> **snapshot**: [`TradeEvent`](TradeEvent.md)

***

### trade.update

> **update**: [`TradeEvent`](TradeEvent.md)

***

### user.account.snapshot

> **snapshot**: [`UserAccountEvent`](UserAccountEvent.md)

***

### user.account.update

> **update**: [`UserAccountEvent`](UserAccountEvent.md)

***

### user.adRatio.snapshot

> **snapshot**: [`UserAdRatioEvent`](UserAdRatioEvent.md)

***

### user.adRatio.update

> **update**: [`UserAdRatioEvent`](UserAdRatioEvent.md)

***

### user.borrowing.snapshot

> **snapshot**: [`UserBorrowingEvent`](UserBorrowingEvent.md)

***

### user.borrowing.update

> **update**: [`UserBorrowingEvent`](UserBorrowingEvent.md)

***

### user.mwallet.account.snapshot

> **snapshot**: [`UserAccountEvent`](UserAccountEvent.md)

***

### user.mwallet.account.update

> **update**: [`UserAccountEvent`](UserAccountEvent.md)

***

### user.mwallet.order.snapshot

> **snapshot**: [`UserOrderEvent`](UserOrderEvent.md)

***

### user.mwallet.order.update

> **update**: [`UserOrderEvent`](UserOrderEvent.md)

***

### user.mwallet.trade.snapshot

> **snapshot**: [`UserTradeEvent`](UserTradeEvent.md)

***

### user.mwallet.trade.update

> **update**: [`UserTradeEvent`](UserTradeEvent.md)

***

### user.order.snapshot

> **snapshot**: [`UserOrderEvent`](UserOrderEvent.md)

***

### user.order.update

> **update**: [`UserOrderEvent`](UserOrderEvent.md)

***

### user.trade.snapshot

> **snapshot**: [`UserTradeEvent`](UserTradeEvent.md)

***

### user.trade.update

> **update**: [`UserTradeEvent`](UserTradeEvent.md)

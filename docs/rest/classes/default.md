[**max-exchange-api-node**](../../README.md) • **Docs**

***

[max-exchange-api-node](../../modules.md) / [rest](../README.md) / default

# Class: default

MaxSDK class for interacting with the MAX API.

## Constructors

### new default()

> **new default**(`options`, `url`?): [`default`](default.md)

Creates an instance of MaxSDK.

#### Parameters

• **options**: [`MAXOptions`](../../types/interfaces/MAXOptions.md)

options for the Rest API.

• **url?**: `string` = `BASE_URL`

The base URL for the API.

#### Returns

[`default`](default.md)

## Methods

### calibrateTime()

> **calibrateTime**(): `Promise`\<`string`\>

Calibrate the local time with the server time.
This method fetches the server time and compares it with the local time.
If the difference is larger than 30 seconds, it adjusts the local time difference.

#### Returns

`Promise`\<`string`\>

A promise that resolves to a string message indicating whether the time was synced or not.

***

### cancelAllOrders()

> **cancelAllOrders**(`walletType`, `params`): `Promise`\<`object`[]\>

Cancel all your orders with given market and side in different wallet type.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for cancelling all orders.

• **params.group\_id?**: `number` = `...`

• **params.market?**: `string` = `...`

• **params.side?**: `"buy"` \| `"sell"` = `...`

#### Returns

`Promise`\<`object`[]\>

A promise that resolves to an array of objects indicating success for each cancelled order.

***

### cancelOrder()

> **cancelOrder**(`params`): `Promise`\<`object`\>

Cancel an order.

#### Parameters

• **params**

The parameters for cancelling an order.

• **params.clientOid?**: `string` = `...`

• **params.id?**: `number` = `...`

#### Returns

`Promise`\<`object`\>

A promise that resolves to an object indicating success.

##### success

> **success**: `boolean`

***

### getAccounts()

> **getAccounts**(`walletType`, `params`): `Promise`\<[`Account`](../types/interfaces/Account.md)[]\>

Get your account balance with all supported currencies by different wallet type.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for fetching account balances.

• **params.currency?**: `string` = `...`

#### Returns

`Promise`\<[`Account`](../types/interfaces/Account.md)[]\>

A promise that resolves to an array of Account objects.

***

### getAdRatio()

> **getAdRatio**(): `Promise`\<[`AdRatio`](../types/interfaces/AdRatio.md)\>

Get the latest AD ratio of your m-wallet.

#### Returns

`Promise`\<[`AdRatio`](../types/interfaces/AdRatio.md)\>

A promise that resolves to an AdRatio object.

***

### getClosedOrders()

> **getClosedOrders**(`walletType`, `params`): `Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

Get closed orders.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for fetching closed orders.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.orderBy?**: `"asc"` \| `"desc"` \| `"asc_updated_at"` \| `"desc_updated_at"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getCurrencies()

> **getCurrencies**(): `Promise`\<[`Currency`](../types/interfaces/Currency.md)[]\>

Get all available currencies.

#### Returns

`Promise`\<[`Currency`](../types/interfaces/Currency.md)[]\>

A promise that resolves to an array of Currency objects.

***

### getDeposit()

> **getDeposit**(`params`): `Promise`\<[`Deposit`](../types/interfaces/Deposit.md)\>

Get details of a specific deposit.

#### Parameters

• **params**

The parameters for fetching deposit details.

• **params.txid?**: `string` = `...`

• **params.uuid?**: `string` = `...`

#### Returns

`Promise`\<[`Deposit`](../types/interfaces/Deposit.md)\>

A promise that resolves to a Deposit object.

***

### getDeposits()

> **getDeposits**(`params`): `Promise`\<[`Deposit`](../types/interfaces/Deposit.md)[]\>

Get external deposits history.

#### Parameters

• **params**

The parameters for fetching deposit history.

• **params.currency?**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Deposit`](../types/interfaces/Deposit.md)[]\>

A promise that resolves to an array of Deposit objects.

***

### getDepth()

> **getDepth**(`params`): `Promise`\<[`Depth`](../types/interfaces/Depth.md)\>

Get depth of a specified market.

#### Parameters

• **params**

The parameters for fetching market depth.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.sortByPrice?**: `boolean` = `...`

#### Returns

`Promise`\<[`Depth`](../types/interfaces/Depth.md)\>

A promise that resolves to an object containing ask and bid orders, and timestamp.

***

### getHistoricalIndexPrices()

> **getHistoricalIndexPrices**(`params`): `Promise`\<[`IndexPrice`](../types/interfaces/IndexPrice.md)[]\>

Get latest historical index prices.

#### Parameters

• **params**

The parameters for fetching historical index prices.

• **params.endTime**: `number` = `...`

• **params.market**: `string` = `...`

• **params.startTime**: `number` = `...`

#### Returns

`Promise`\<[`IndexPrice`](../types/interfaces/IndexPrice.md)[]\>

A promise that resolves to an array of IndexPrice objects.

***

### getIndexPrices()

> **getIndexPrices**(): `Promise`\<[`IndexPrices`](../types/type-aliases/IndexPrices.md)\>

Get latest index prices of m-wallet.

#### Returns

`Promise`\<[`IndexPrices`](../types/type-aliases/IndexPrices.md)\>

A promise that resolves to IndexPrices objects.

***

### getInterestRates()

> **getInterestRates**(): `Promise`\<[`BorrowingInterestRates`](../types/type-aliases/BorrowingInterestRates.md)\>

Get latest interest rates of m-wallet.

#### Returns

`Promise`\<[`BorrowingInterestRates`](../types/type-aliases/BorrowingInterestRates.md)\>

A promise that resolves to the latest interest rates.

***

### getInterests()

> **getInterests**(`params`): `Promise`\<[`Interest`](../types/interfaces/Interest.md)[]\>

Get interest history of your m-wallet.

#### Parameters

• **params**

The parameters for fetching interest history.

• **params.currency?**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Interest`](../types/interfaces/Interest.md)[]\>

A promise that resolves to an array of Interest objects.

***

### getInternalTransfers()

> **getInternalTransfers**(`params`): `Promise`\<[`InternalTransfer`](../types/interfaces/InternalTransfer.md)[]\>

Get internal transfers history.

#### Parameters

• **params**

The parameters for fetching internal transfer history.

• **params.currency?**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.side**: `"in"` \| `"out"` = `SideSchema`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`InternalTransfer`](../types/interfaces/InternalTransfer.md)[]\>

A promise that resolves to an array of InternalTransfer objects.

***

### getKLine()

> **getKLine**(`params`): `Promise`\<[`Date`, `Decimal`, `Decimal`, `Decimal`, `Decimal`, `Decimal`][]\>

Get OHLC(k line) of a specific market.

#### Parameters

• **params**

The parameters for fetching K-line data.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.period?**: `number` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Date`, `Decimal`, `Decimal`, `Decimal`, `Decimal`, `Decimal`][]\>

A promise that resolves to an array of K-line data.

***

### getLimits()

> **getLimits**(): `Promise`\<[`BorrowingLimits`](../types/type-aliases/BorrowingLimits.md)\>

Get total available loan amount.

#### Returns

`Promise`\<[`BorrowingLimits`](../types/type-aliases/BorrowingLimits.md)\>

A promise that resolves to the available loan amount.

***

### getLiquidationDetail()

> **getLiquidationDetail**(`params`): `Promise`\<[`LiquidationDetail`](../types/interfaces/LiquidationDetail.md)\>

Get detail of one specific liquidation history of your m-wallet.

#### Parameters

• **params**

The parameters for fetching liquidation detail.

• **params.sn**: `string` = `...`

#### Returns

`Promise`\<[`LiquidationDetail`](../types/interfaces/LiquidationDetail.md)\>

A promise that resolves to a LiquidationDetail object.

***

### getLiquidations()

> **getLiquidations**(`params`): `Promise`\<[`Liquidation`](../types/interfaces/Liquidation.md)[]\>

Get liquidation history of your m-wallet.

#### Parameters

• **params**

The parameters for fetching liquidation history.

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Liquidation`](../types/interfaces/Liquidation.md)[]\>

A promise that resolves to an array of Liquidation objects.

***

### getLoans()

> **getLoans**(`params`): `Promise`\<[`Debt`](../types/interfaces/Debt.md)[]\>

Get loan history of your m-wallet.

#### Parameters

• **params**

The parameters for fetching loan history.

• **params.currency**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Debt`](../types/interfaces/Debt.md)[]\>

A promise that resolves to an array of Debt objects.

***

### getMarkets()

> **getMarkets**(): `Promise`\<[`Market`](../types/interfaces/Market.md)[]\>

Get all available markets.

#### Returns

`Promise`\<[`Market`](../types/interfaces/Market.md)[]\>

A promise that resolves to an array of Market objects.

***

### getOpenOrders()

> **getOpenOrders**(`walletType`, `params`): `Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

Get open orders.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for fetching open orders.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.orderBy?**: `"asc"` \| `"desc"` \| `"asc_updated_at"` \| `"desc_updated_at"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getOrder()

> **getOrder**(`params`): `Promise`\<[`Order`](../types/interfaces/Order.md)\>

Get order detail.

#### Parameters

• **params**

The parameters for fetching order details.

• **params.clientOid?**: `string` = `...`

• **params.id?**: `number` = `...`

#### Returns

`Promise`\<[`Order`](../types/interfaces/Order.md)\>

A promise that resolves to an Order object.

***

### getOrderHistory()

> **getOrderHistory**(`walletType`, `params`): `Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

Get order history in ascending order from a specific from_id.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for fetching order history.

• **params.fromId?**: `number` = `...`

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

#### Returns

`Promise`\<[`Order`](../types/interfaces/Order.md)[]\>

A promise that resolves to an array of Order objects.

***

### getOrderTrades()

> **getOrderTrades**(`params`): `Promise`\<[`Trade`](../types/interfaces/Trade.md)[]\>

Get trade detail by your order info.

#### Parameters

• **params**

The parameters for fetching order trades.

• **params.clientOid?**: `string` = `...`

• **params.orderId?**: `number` = `...`

#### Returns

`Promise`\<[`Trade`](../types/interfaces/Trade.md)[]\>

A promise that resolves to an array of Trade objects.

***

### getPublicTrades()

> **getPublicTrades**(`params`): `Promise`\<[`PublicTrade`](../types/interfaces/PublicTrade.md)[]\>

Get recent trades on market, sorted in reverse creation order.

#### Parameters

• **params**

The parameters for fetching public trades.

• **params.limit?**: `number` = `...`

• **params.market**: `string` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`PublicTrade`](../types/interfaces/PublicTrade.md)[]\>

A promise that resolves to an array of PublicTrade objects.

***

### getRepayments()

> **getRepayments**(`params`): `Promise`\<[`ManualRepayment`](../types/interfaces/ManualRepayment.md)[]\>

Get repayment history of your m-wallet.

#### Parameters

• **params**

The parameters for fetching repayment history.

• **params.currency**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`ManualRepayment`](../types/interfaces/ManualRepayment.md)[]\>

A promise that resolves to an array of ManualRepayment objects.

***

### getRewards()

> **getRewards**(`params`): `Promise`\<[`Reward`](../types/interfaces/Reward.md)[]\>

Get rewards history.

#### Parameters

• **params**

The parameters for fetching rewards history.

• **params.currency?**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.rewardType?**: `"vip_rebate"` \| `"staking_reward"` \| `"redemption_reward"` \| `"commission"` \| `"airdrop_reward"` \| `"trading_reward"` \| `"mining_reward"` \| `"holding_reward"` \| `"yield"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Reward`](../types/interfaces/Reward.md)[]\>

A promise that resolves to an array of Reward objects.

***

### getTicker()

> **getTicker**(`params`): `Promise`\<[`Ticker`](../types/interfaces/Ticker.md)\>

Get ticker of specific market.

#### Parameters

• **params**

The parameters for fetching a specific ticker.

• **params.market**: `string` = `...`

#### Returns

`Promise`\<[`Ticker`](../types/interfaces/Ticker.md)\>

A promise that resolves to a Ticker object.

***

### getTickers()

> **getTickers**(`params`): `Promise`\<[`Ticker`](../types/interfaces/Ticker.md)[]\>

Get ticker of all markets.

#### Parameters

• **params**

The parameters for fetching tickers.

• **params.markets**: `string`[] = `...`

#### Returns

`Promise`\<[`Ticker`](../types/interfaces/Ticker.md)[]\>

A promise that resolves to an array of Ticker objects.

***

### getTimestamp()

> **getTimestamp**(): `Promise`\<[`Timestamp`](../types/interfaces/Timestamp.md)\>

Get server current time, in seconds since Unix epoch.

#### Returns

`Promise`\<[`Timestamp`](../types/interfaces/Timestamp.md)\>

A promise that resolves to a Timestamp object.

***

### getTrades()

> **getTrades**(`walletType`, `params`): `Promise`\<[`Trade`](../types/interfaces/Trade.md)[]\>

Get executed trades.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

• **params**

The parameters for fetching trades.

• **params.fromId?**: `number` = `...`

• **params.limit?**: `number` = `...`

• **params.market?**: `string` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Trade`](../types/interfaces/Trade.md)[]\>

A promise that resolves to an array of Trade objects.

***

### getTransfers()

> **getTransfers**(`params`): `Promise`\<[`BorrowingTransfer`](../types/interfaces/BorrowingTransfer.md)[]\>

List transactions between your spot wallet and m-wallet.

#### Parameters

• **params**

The parameters for fetching transfers.

• **params.currency**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.side**: `"in"` \| `"out"` = `SideSchema`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`BorrowingTransfer`](../types/interfaces/BorrowingTransfer.md)[]\>

A promise that resolves to an array of BorrowingTransfer objects.

***

### getUserInfo()

> **getUserInfo**(): `Promise`\<[`UserInfo`](../types/interfaces/UserInfo.md)\>

Get user information.

#### Returns

`Promise`\<[`UserInfo`](../types/interfaces/UserInfo.md)\>

A promise that resolves to a UserInfo object.

***

### getWithdrawAddresses()

> **getWithdrawAddresses**(`params`): `Promise`\<[`FundSource`](../types/interfaces/FundSource.md)[]\>

Get withdraw addresses of spot wallet.

#### Parameters

• **params**

The parameters for fetching withdraw addresses.

• **params.currency**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.offset?**: `number` = `...`

#### Returns

`Promise`\<[`FundSource`](../types/interfaces/FundSource.md)[]\>

A promise that resolves to an array of FundSource objects.

***

### getWithdrawal()

> **getWithdrawal**(`params`): `Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

Get details of a specific external withdraw.

#### Parameters

• **params**

The parameters for fetching withdrawal details.

• **params.uuid**: `string` = `...`

#### Returns

`Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

A promise that resolves to a Withdrawal object.

***

### getWithdrawals()

> **getWithdrawals**(`params`): `Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)[]\>

Get external withdrawals history.

#### Parameters

• **params**

The parameters for fetching withdrawal history.

• **params.currency?**: `string` = `...`

• **params.limit?**: `number` = `...`

• **params.order?**: `"asc"` \| `"desc"` = `...`

• **params.state?**: `"processing"` \| `"failed"` \| `"canceled"` \| `"done"` = `...`

• **params.timestamp?**: `number` = `...`

#### Returns

`Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)[]\>

A promise that resolves to an array of Withdrawal objects.

***

### submitLoan()

> **submitLoan**(`params`): `Promise`\<[`Debt`](../types/interfaces/Debt.md)\>

Create a loan request for your m-wallet.

#### Parameters

• **params**

The parameters for submitting a loan.

• **params.amount**: `string` = `...`

• **params.currency**: `string` = `...`

#### Returns

`Promise`\<[`Debt`](../types/interfaces/Debt.md)\>

A promise that resolves to a Debt object.

***

### submitOrder()

> **submitOrder**(`walletType`, `params`): `Promise`\<[`Order`](../types/interfaces/Order.md)\>

Create sell/buy order.

#### Parameters

• **walletType**: `"spot"` \| `"m"`

The wallet type (spot or m).

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

`Promise`\<[`Order`](../types/interfaces/Order.md)\>

A promise that resolves to an Order object.

***

### submitRepayment()

> **submitRepayment**(`params`): `Promise`\<[`ManualRepayment`](../types/interfaces/ManualRepayment.md)\>

Make a repayment for your loan.

#### Parameters

• **params**

The parameters for submitting a repayment.

• **params.amount**: `string` = `...`

• **params.currency**: `string` = `...`

#### Returns

`Promise`\<[`ManualRepayment`](../types/interfaces/ManualRepayment.md)\>

A promise that resolves to a ManualRepayment object.

***

### submitTWDWithdrawal()

> **submitTWDWithdrawal**(`params`): `Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

Submit twd withdrawal to verified bank account. IP whitelist for api token is required.

#### Parameters

• **params**

The parameters for submitting a TWD withdrawal.

• **params.amount**: `string` = `...`

#### Returns

`Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

A promise that resolves to a Withdrawal object.

***

### submitWithdrawal()

> **submitWithdrawal**(`params`): `Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

Submit a crypto withdrawal. IP whitelist for api token is required.

#### Parameters

• **params**

The parameters for submitting a withdrawal.

• **params.amount**: `string` = `...`

• **params.withdrawAddressUuid**: `string` = `...`

#### Returns

`Promise`\<[`Withdrawal`](../types/interfaces/Withdrawal.md)\>

A promise that resolves to a Withdrawal object.

***

### transferBetweenWallets()

> **transferBetweenWallets**(`params`): `Promise`\<[`BorrowingTransfer`](../types/interfaces/BorrowingTransfer.md)\>

Create a transaction between your spot wallet and m-wallet.

#### Parameters

• **params**

The parameters for transferring between wallets.

• **params.amount**: `string` = `...`

• **params.currency**: `string` = `...`

• **params.side**: `"in"` \| `"out"` = `SideSchema`

#### Returns

`Promise`\<[`BorrowingTransfer`](../types/interfaces/BorrowingTransfer.md)\>

A promise that resolves to a BorrowingTransfer object.

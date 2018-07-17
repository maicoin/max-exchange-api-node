<a name="RestV2"></a>

## RestV2
Access to MAX Rest API V2

**Kind**: global class  

* [RestV2](#RestV2)
    * [new RestV2(options)](#new_RestV2_new)
    * [.markets()](#RestV2+markets) ⇒ <code>Promise</code>
    * [.currencies()](#RestV2+currencies) ⇒ <code>Promise</code>
    * [.tickers()](#RestV2+tickers) ⇒ <code>Promise</code>
    * [.ticker(options)](#RestV2+ticker) ⇒ <code>Promise</code>
    * [.orderBook(options)](#RestV2+orderBook) ⇒ <code>Promise</code>
    * [.depth(options)](#RestV2+depth) ⇒ <code>Promise</code>
    * [.marketTrades(options)](#RestV2+marketTrades) ⇒ <code>Promise</code>
    * [.k(options)](#RestV2+k) ⇒ <code>Promise</code>
    * [.timestamp(options)](#RestV2+timestamp) ⇒ <code>Promise</code>
    * [.me()](#RestV2+me) ⇒ <code>Promise</code>
    * [.deposits([options])](#RestV2+deposits) ⇒ <code>Promise</code>
    * [.deposit(options, txid)](#RestV2+deposit) ⇒ <code>Promise</code>
    * [.depositAddresses([options])](#RestV2+depositAddresses) ⇒ <code>Promise</code>
    * [.withdrawals([options])](#RestV2+withdrawals) ⇒ <code>Promise</code>
    * [.withdrawal(options)](#RestV2+withdrawal) ⇒ <code>Promise</code>
    * [.orders(options)](#RestV2+orders) ⇒ <code>Promise</code>
    * [.order(options)](#RestV2+order) ⇒ <code>Promise</code>
    * [.trades(options)](#RestV2+trades) ⇒ <code>Promise</code>
    * [.placeOrder(options)](#RestV2+placeOrder) ⇒ <code>Promise</code>
    * [.placeOrders(options)](#RestV2+placeOrders) ⇒ <code>Promise</code>
    * [.cancelOrders(options)](#RestV2+cancelOrders) ⇒ <code>Promise</code>
    * [.cancelOrder(options)](#RestV2+cancelOrder) ⇒ <code>Promise</code>

<a name="new_RestV2_new"></a>

### new RestV2(options)
Initialize a Restv2 class.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| [options.accessKey] | <code>string</code> | 
| [options.secretKey] | <code>string</code> | 

<a name="RestV2+markets"></a>

### restV2.markets() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Markets  
<a name="RestV2+currencies"></a>

### restV2.currencies() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Currencies  
<a name="RestV2+tickers"></a>

### restV2.tickers() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Tickers  
<a name="RestV2+ticker"></a>

### restV2.ticker(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2TickersMarket  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.market | <code>string</code> | unique market id, check markets() for available markets. Ex: 'btctwd' |

<a name="RestV2+orderBook"></a>

### restV2.orderBook(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2OrderBook  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.asksLimit] | <code>number</code> | <code>20</code> | returned sell orders limit |
| [options.bidsLimit] | <code>number</code> | <code>20</code> | returned buy orders limit |

<a name="RestV2+depth"></a>

### restV2.depth(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Depth  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.limit] | <code>number</code> | <code>300</code> | returned price levels limit |

<a name="RestV2+marketTrades"></a>

### restV2.marketTrades(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Trades  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.limit] | <code>number</code> | <code>50</code> | returned trades limit, in range from 1 to 1000 |
| [options.from] | <code>number</code> |  | trade id, set ot return trades created after the trade |
| [options.to] | <code>number</code> |  | trade id, set to return trades created before the trade |
| [options.timestamp] | <code>number</code> |  | the seconds elapsed since Unix epoch, set to return trades executed before the time only |
| [options.orderBy] | <code>string</code> | <code>&quot;desc&quot;</code> | order the trades by created time, 'asc' or 'desc' |

<a name="RestV2+k"></a>

### restV2.k(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2K  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.limit] | <code>number</code> | <code>30</code> | returned data points limit |
| [options.period] | <code>number</code> | <code>1</code> | time period of K line in minute, can be 1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080 |
| [options.timestamp] | <code>number</code> |  | the seconds elapsed since Unix epoch, set to return data after the timestamp only |

<a name="RestV2+timestamp"></a>

### restV2.timestamp(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/public/getApiV2Timestamp  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="RestV2+me"></a>

### restV2.me() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2MembersMe  
<a name="RestV2+deposits"></a>

### restV2.deposits([options]) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Deposits  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.currency] | <code>string</code> |  | unique currency id, check currencies() for available currencies |
| [options.state] | <code>string</code> |  | deposit state filter |
| [options.limit] | <code>number</code> | <code>3</code> | returned results limit, maximum 100 |
| [options.offset] | <code>number</code> | <code>0</code> | pagination offset |
| [options.from] | <code>number</code> |  | target period start (Epoch time in seconds) |
| [options.to] | <code>number</code> |  | target period end (Epoch time in seconds) |

<a name="RestV2+deposit"></a>

### restV2.deposit(options, txid) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Deposit  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| txid | <code>string</code> | unique transaction id |

<a name="RestV2+depositAddresses"></a>

### restV2.depositAddresses([options]) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2DepositAddress  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.currency] | <code>string</code> | unique currency id, check currencies() for available currencies |

<a name="RestV2+withdrawals"></a>

### restV2.withdrawals([options]) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Withdrawals  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.currency] | <code>string</code> |  | unique currency id, check currencies() for available currencies |
| [options.state] | <code>string</code> |  | withdrawal state filter |
| [options.limit] | <code>number</code> | <code>3</code> | returned results limit, maximum 100 |
| [options.offset] | <code>number</code> | <code>0</code> | pagination offset |
| [options.from] | <code>number</code> |  | target period start (Epoch time in seconds) |
| [options.to] | <code>number</code> |  | target period end (Epoch time in seconds) |

<a name="RestV2+withdrawal"></a>

### restV2.withdrawal(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Withdrawal  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.uuid | <code>string</code> | unique withdraw id |

<a name="RestV2+orders"></a>

### restV2.orders(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Orders  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.state] | <code>string</code> |  | order state filter |
| [options.limit] | <code>number</code> | <code>3</code> | returned results limit, maximum 100 |
| [options.page] | <code>number</code> | <code>1</code> | specify the page of paginated results |
| [options.orderBy] | <code>string</code> | <code>&quot;desc&quot;</code> | order in created time, 'desc' or 'asc' |

<a name="RestV2+order"></a>

### restV2.order(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2Order  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.id | <code>number</code> | unique order id |

<a name="RestV2+trades"></a>

### restV2.trades(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/getApiV2TradesMy  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.market | <code>string</code> |  | unique market id, check markets() for available markets. Ex: 'btctwd' |
| [options.limit] | <code>number</code> | <code>50</code> | returned trades limit, in range from 1 to 1000 |
| [options.timestamp] | <code>number</code> |  | the seconds elapsed since Unix epoch, set to return trades executed before the time only |
| [options.from] | <code>number</code> |  | trade id, set ot return trades created after the trade |
| [options.to] | <code>number</code> |  | trade id, set to return trades created before the trade |
| [options.orderBy] | <code>string</code> | <code>&quot;desc&quot;</code> | order the trades by created time, 'desc' or 'asc' |

<a name="RestV2+placeOrder"></a>

### restV2.placeOrder(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/postApiV2Orders  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.market | <code>string</code> | unique market id, check markets() for available markets. Ex: 'btctwd' |
| options.side | <code>string</code> | 'sell' or 'buy' |
| options.volume | <code>string</code> | total amount to sell/buy, an order could be partially executed |
| [options.price] | <code>string</code> | price of a unit, required for limit order |
| [options.ordType] | <code>string</code> | order type, 'limit' or 'market' |

<a name="RestV2+placeOrders"></a>

### restV2.placeOrders(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/postApiV2OrdersMulti  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.market | <code>string</code> | unique market id, check markets() for available markets. Ex: 'btctwd' |
| options.orders | <code>Array.&lt;Object&gt;</code> | array of orders detail |
| options.orders[].side | <code>string</code> | 'sell' or 'buy' |
| options.orders[].volume | <code>string</code> | total amount to sell/buy, an order could be partially executed |
| [options.orders[].price] | <code>string</code> | price of a unit, required for limit order |
| [options.orders[].ordType] | <code>string</code> | order type, 'limit' or 'market' |

<a name="RestV2+cancelOrders"></a>

### restV2.cancelOrders(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/postApiV2OrdersClear  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.market] | <code>string</code> | specify market, ex: 'btctwd'. Cancel all markets if not set. |
| [options.side] | <code>string</code> | 'sell' or 'buy'. Cancel both sides if not set. |

<a name="RestV2+cancelOrder"></a>

### restV2.cancelOrder(options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>RestV2</code>](#RestV2)  
**See**: https://max.maicoin.com/documents/api_list#!/private/postApiV2OrderDelete  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.id | <code>number</code> | unique order id |


<a name="WSV1"></a>

## WSV1
**Kind**: global class  

* [WSV1](#WSV1)
    * [new WSV1(options)](#new_WSV1_new)
    * [.open()](#WSV1+open) ⇒ <code>Promise</code>
    * [.close()](#WSV1+close) ⇒ <code>Promise</code>
    * [.subscribeTicker(market)](#WSV1+subscribeTicker)
    * [.unsubscribeTicker(market)](#WSV1+unsubscribeTicker)
    * [.subscribeOrderBook(market)](#WSV1+subscribeOrderBook)
    * [.unsubscribeOrderBook(market)](#WSV1+unsubscribeOrderBook)
    * [.subscribeAccount()](#WSV1+subscribeAccount)
    * [.unsubscribeAccount()](#WSV1+unsubscribeAccount)

<a name="new_WSV1_new"></a>

### new WSV1(options)
Initialize a websocket transport class.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| [options.accessKey] | <code>string</code> | 
| [options.secretKey] | <code>string</code> | 

<a name="WSV1+open"></a>

### wsV1.open() ⇒ <code>Promise</code>
Opens a connection to the websocket API server. Will reject open if websocket is already
connected.

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  
<a name="WSV1+close"></a>

### wsV1.close() ⇒ <code>Promise</code>
Close a websocket connection when it was connected.

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  
<a name="WSV1+subscribeTicker"></a>

### wsV1.subscribeTicker(market)
Subscribe Ticker

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  

| Param | Type | Description |
| --- | --- | --- |
| market | <code>string</code> | unique market id, ex: 'btctwd' |

<a name="WSV1+unsubscribeTicker"></a>

### wsV1.unsubscribeTicker(market)
Unsbscribe Ticker

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  

| Param | Type | Description |
| --- | --- | --- |
| market | <code>string</code> | unique market id, ex: 'btctwd' |

<a name="WSV1+subscribeOrderBook"></a>

### wsV1.subscribeOrderBook(market)
Subscribe Order Book

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  

| Param | Type | Description |
| --- | --- | --- |
| market | <code>string</code> | unique market id, ex: 'btctwd' |

<a name="WSV1+unsubscribeOrderBook"></a>

### wsV1.unsubscribeOrderBook(market)
Unsubscribe Order Book

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  

| Param | Type | Description |
| --- | --- | --- |
| market | <code>string</code> | unique market id, ex: 'btctwd' |

<a name="WSV1+subscribeAccount"></a>

### wsV1.subscribeAccount()
Subscribe Account

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  
<a name="WSV1+unsubscribeAccount"></a>

### wsV1.unsubscribeAccount()
Unsubscribe Account

**Kind**: instance method of [<code>WSV1</code>](#WSV1)  

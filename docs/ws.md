<a name="WebSocketAPI"></a>

## WebSocketAPI
**Kind**: global class  

* [WebSocketAPI](#WebSocketAPI)
    * [new WebSocketAPI(options)](#new_WebSocketAPI_new)
    * [.subscribe](#WebSocketAPI+subscribe)
        * [new WebSocketAPI#subscribe(channel, market, [options])](#new_WebSocketAPI+subscribe_new)
    * [.connect()](#WebSocketAPI+connect)

<a name="new_WebSocketAPI_new"></a>

### new WebSocketAPI(options)
Initialize a WebSocket connection


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| [options.accessKey] | <code>string</code> | 
| [options.secretKey] | <code>string</code> | 

<a name="WebSocketAPI+subscribe"></a>

### webSocketAPI.subscribe
**Kind**: instance class of [<code>WebSocketAPI</code>](#WebSocketAPI)  
<a name="new_WebSocketAPI+subscribe_new"></a>

#### new WebSocketAPI#subscribe(channel, market, [options])
Add subscription to the websocket session.
The subscription messages will be sent to the server when `connect` method is called.


| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | The public market data channel. valid channels are: 'kline', 'trade', 'book' |
| market | <code>string</code> | The market name of the subscription. the given string should be in lower-case |
| [options] | <code>string</code> | The options of the subscription |
| [options.depth] | <code>number</code> | The depth of the book data. defaults to the whole book. |
| [options.interval] | <code>string</code> | The interval of the kline data. |

<a name="WebSocketAPI+connect"></a>

### webSocketAPI.connect()
Connect creates the websocket connection and setup the message handlers.

**Kind**: instance method of [<code>WebSocketAPI</code>](#WebSocketAPI)  

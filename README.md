# MAX Exchange API for Node.js

A node.js implementation of MAX exchange API

* REST API V2
* Websocket API

## Documentations

* [REST API Introduction](https://max.maicoin.com/documents/api_v2)
* [REST API End Points](https://max.maicoin.com/documents/api_list)
* [WebSocket API Documentation](https://maicoin.github.io/max-websocket-docs/)

## Installation

```
npm install max-exchange-api-node
```

see `/docs` for MAX and RESTV2, WebSocketAPI methods.

see `/examples` for WebSocket Usages.

## Usage

MAX constructor will return a client manager to support REST API.

```js
const MAX = require('max-exchange-api-node')

const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})
```

MAX object will cache client by versions.

``` js
const rest = max.rest() // default version is 2
const rest2 = max.rest(2) // the same client as rest

// get current markets
rest.markets()
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.log(error.message)
  })

// retrieve orders which is in `wait`, `convert`, or `done` state
rest.orders({ market: 'maxtwd', state: ['wait', 'convert', 'done'] })
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.log(error.message)
  })
})
```

Example for subscribing orderbook from websocket API

```js
const ws = max.ws()
const book = new WebSocketBook(ws, 'btctwd', 10)

book.onUpdate((book) => {
  book.pretty()
})

ws.on('error', (errors) => {
  console.error(errors)
})
// ws.on('raw', (body) => console.log(body) )
ws.connect()
```

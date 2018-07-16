# MAX Exchange API for Node.js

A node.js implementation of MAX exchange API

* REST API V2
* Websocket API (TBD)

## Documentations

* [REST API Introduction](https://max.maicoin.com/documents/api_v2)
* [REST API End Points](https://max.maicoin.com/documents/api_list)

## Installation

```
npm install max-exchange-api
```

see `/docs` for MAX and RESTV2 methods.

## Usage

MAX constructor will return a client manager to support REST API.

```js
const MAX = require('max-exchange-api')

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
rest.markets().then((data) => {
  console.log(data)
})
```

# MAX Exchange API for Node.js

A Node.js implementation of MAX exchange API

* MAX V3 RESTful API
* WebSocket API
* Supports both CommonJS and ES Modules

This library provides a flexible and easy-to-use interface for interacting with the MAX exchange API. It is designed to work seamlessly in both CommonJS and ES Module environments, allowing you to use it in a wide range of Node.js projects.

## Features

- Full support for MAX exchange REST API V3
- Real-time data streaming with WebSocket API
- Compatible with CommonJS (`require()`) and ES Modules (`import`)
- Comprehensive error handling
- Time synchronization utilities

## Documentation

* [REST API Introduction](https://max.maicoin.com/documents/api_v2)
* [REST API End Points](https://max.maicoin.com/documents/api_list/v3)
* [WebSocket API Documentation](https://maicoin.github.io/max-websocket-docs/)

## Installation

```
npm install max-exchange-api-node
```

See `/docs` for MAX, MaxSDK, and WebSocketAPI methods.

See `/examples` for usage examples.

## Usage

You can use this library with either CommonJS or ES Modules syntax:

### ES Modules

```javascript
import { MAX } from 'max-exchange-api-node';

const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});
```

### CommonJS

```javascript
const { MAX } = require('max-exchange-api-node');

const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});
```

### REST API

Access the REST API through `max.rest`:

```js
import { MAX } from 'max-exchange-api-node';

const { rest } = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

// Get current markets
try {
  const markets = await rest.getMarkets();
  console.log(markets);
} catch (error) {
  console.error(error.message);
}

// Get account balances
try {
  const accounts = await rest.spotWallet.getAccounts({ market: 'btc' });
  console.log(accounts);
} catch (error) {
  console.error(error.message);
}

// Place a limit order
try {
  const order = await rest.spotWallet.submitOrder({
    market: 'btctwd',
    side: 'buy',
    volume: '0.001',
    price: '500000',
    ord_type: 'limit'
  });
  console.log(order);
} catch (error) {
  console.error(error.message);
}

// Get open orders
try {
  const orders = await rest.spotWallet.getOpenOrders({ market: 'btctwd' });
  console.log(orders);
} catch (error) {
  console.error(error.message);
}
```

### WebSocket API

Access the WebSocket API through `max.ws`:

```js
import { MAX } from 'max-exchange-api-node';

const { ws } = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

// Subscribe to orderbook updates
ws.subscribe('book', 'btctwd', { depth: 5 });

// Subscribe to trade updates
ws.subscribe('trade', 'btctwd');

ws.on('open', () => {
  console.log('WebSocket connected');
});

ws.on('book.snapshot', (data) => {
  console.log('Orderbook snapshot:', data);
});

ws.on('book.update', (data) => {
  console.log('Orderbook update:', data);
});

ws.on('trade.update', (data) => {
  console.log('New trade:', data);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('WebSocket disconnected');
});

ws.connect();

```

## Error Handling

Both REST and WebSocket methods may throw errors. It's recommended to use try-catch blocks to handle potential errors:

```js
import { MAX } from 'max-exchange-api-node';

const { rest } = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

try {
  const ticker = await rest.getTicker({ market: 'btctwd' });
  console.log(ticker);
} catch (error) {
  console.error('An error occurred:', error.message);
}
```

## Calibrating Time

To ensure your local time is synchronized with the server time, you can use the `calibrateTime` method:

```js
import { MAX } from 'max-exchange-api-node';

const { rest } = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

try {
  const message = await rest.calibrateTime();
  console.log(message);
} catch (error) {
  console.error('Failed to calibrate time:', error.message);
}
```

For more detailed information about available methods and their parameters, please refer to the documentation in the `/docs` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
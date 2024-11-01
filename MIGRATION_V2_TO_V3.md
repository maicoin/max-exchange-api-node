# MAX Exchange API Node.js Library Migration Guide (v2.0.0 → v3.0.0)

This guide will help you migrate from version 2.0.0 to version 3.0.0 of the MAX Exchange API Node.js library.

## Major Changes

### 1. New Functions
- Add m-wallet trading features
- Enhanced withdrawal options (TWD support)
- Internal transfers and rewards tracking

### 2. Module Import/Export System
- Now supports both CommonJS and ES Modules
- Old version only supported CommonJS

### 3. Type Support
- Full TypeScript support
- Comprehensive type definitions



## Client Initialization

```javascript
// Old version
const MAX = require('max-exchange-api-node')
const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})
const rest = max.rest() // or max.rest(2)
const ws = max.ws() 

// New version
// ESM
import { MAX } from 'max-exchange-api-node'
// or CommonJS
const { MAX } = require('max-exchange-api-node')

const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})
const { rest, ws } = max  // REST and WebSocket client are now properties
```

## REST API Changes

### Key Changes

#### 1. Namespacing
- Methods are now organized under specific wallets:
  - `spotWallet`: for spot trading
  - `mWallet`: for margin trading
  - General methods remain at the root level

    Examples: 
    ```js
    // Old version (v2)
    await max.placeOrder({
      market: 'btctwd',
      side: 'buy',
      volume: '1.0',
      price: '10000',
      ord_type: 'limit'  
    });

    // New version (v3)
    // For spot trading
    await max.rest.spotWallet.submitOrder({
      market: 'btctwd',
      side: 'buy',
      volume: '1.0',
      price: '10000',
      ord_type: 'limit', 
    });

    // For margin trading (m-wallet)
    await max.rest.mWallet.submitOrder({
      market: 'btctwd',
      side: 'buy',
      volume: '1.0',
      price: '10000',
      ord_type: 'limit',
    });

    ```
#### 2. Consistent Naming
- Get operations: start with `get`
- Submit operations: start with `submit`
- Cancel operations: use `cancel`
- Create operations: start with `create`


### Market Data Endpoints
| Old Version (v2) | New Version (v3) | Notes |
|------------------|------------------|--------|
| `markets()` | `getMarkets()` | |
| `currencies()` | `getCurrencies()` |  |
| `tickers()` | `getTickers(options)` | Now requires `markets` parameter |
| `ticker(options)` | `getTicker(options)` |  |
| `orderBook(options)` | - | Deprecated |
| `depth(options)` | `getDepth(options)` |  |
| `marketTrades(options)` | `getPublicTrades(options)` |  |
| `k(options)` | `getKLine(options)` |  |
| `timestamp()` | `getTimestamp()` |  |
| `calibrateTime()` | `calibrateTime()` | | 

### Account & Profile Endpoints
| Old Version (v2) | New Version (v3) | |
|-------------|-------------|------|
| `me()` | `getUserInfo()` |  v3 only support api related fields |   
| `profile()` | - | |
| `accounts()` | `(spot/m)Wallet.getAccounts()` |  |
| `account(currency)` | `-` |  |

### Deposit & Withdrawal Endpoints
| Old Version (v2) | New Version (v3) | Notes | 
|-------------|-------------|-------|
| `deposits(options)` | `getDeposits(options)` | |
| `deposit(options, txid)` | `getDeposit(options)` | |
| `depositAddresses(options)` | - |   |
| `generateDepositAddresses()` | - |  |
| `withdrawals(options)` | `getWithdrawals(options)` | |
| `withdrawal(options)` | `getWithdrawal(options)` | |
| - | `submitWithdrawal(options)` | |
| - | `submitTWDWithdrawal(options)` | |
| - | `getWithdrawAddresses(options)` | |


### Trading Endpoints
| Old Version (v2) | New Version (v3) | Notes |
|------------------|------------------|--------|
| `orders(options)` | `spotWallet.getOpenOrders(options)` or `spotWallet.getClosedOrders(options)` | Split into open/closed |
| `order(options)` | `getOrder(options)` |  |
| `placeOrder(options)` | `spotWallet.submitOrder(options)` or `mWallet.submitOrder(options)` | Wallet-specific |
| `placeOrders(options)` | - |  |
| `cancelOrder(options)` | `cancelOrder(options)` |  |
| `cancelOrders(options)` | `spotWallet.cancelAllOrders(options)` or `mWallet.cancelAllOrders(options)` | Wallet-specific |
| `trades(options)` | `spotWallet.getTrades(options)` or `mWallet.getTrades(options)` | Wallet-specific |
| `tradesOfOrder(options)` | `getOrderTrades(options)` |  |
| - | `spotWallet.getOrderHistory(params)` or `mWallet.getOrderHistory(params)` | New in sdk v3 |

### M-Wallet Specific Endpoints

| Old Version | New Version |
|-------------|-------------|
| - | `getIndexPrices()` |
| - | `getHistoricalIndexPrices(params)` |
| - | `getLimits()` |
| - | `getInterestRates()` |
| - | `getAdRatio()` |
| - | `submitLoan(params)` |
| - | `getLoans(params)` |
| - | `submitRepayment(params)` |
| - | `getRepayments(params)` |
| - | `getLiquidations(params)` |
| - | `getLiquidationDetail(params)` |
| - | `getInterests(params)` |

### Transfer & Rewards Endpoints
| Old Version | New Version |
|-------------|-------------|
| - | `transferBetweenWallets(params)` |
| - | `getTransfers(params)` |
| - | `getInternalTransfers(params)` |
| - | `getRewards(params)` |



## WebSocket API Changes

### Key Improvements
- Full TypeScript support for WebSocket events and payloads
- Additional market events and data streams


### Basic Usage
```javascript
// Old version
const max = new MAX({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})
const ws = max.ws()

// New version
import { MAX } from 'max-exchange-api-node'
const { ws } = new MAX({ accessKey: '', secretKey: '' })
```

### Subscription and Event Handling
```javascript
// Both versions support these patterns
ws.subscribe('trade', 'btctwd')
ws.on('trade.snapshot', (e) => console.log(e))
ws.on('trade.update', (e) => console.log(e))
ws.on('error', (errors) => console.error(errors))
ws.connect()
```


## Resources

- [REST API V2 Endpoints](https://max.maicoin.com/documents/api_list/v2)
- [REST API V3 Endpoints](https://max.maicoin.com/documents/api_list/v3)
- [WebSocket API Documentation](https://maicoin.github.io/max-websocket-docs/)

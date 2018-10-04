const Request = require('../utils/send_request')
const validate = require('../utils/validate')
const optionsSchema = require('../utils/options_schema')

/**
 * Access to MAX Rest API V2
 */
class RestV2 {
  /**
   * Initialize a Restv2 class.
   *
   * @constructor
   * @param {Object} options
   * @param {string} [options.accessKey]
   * @param {string} [options.secretKey]
   */
  constructor (options = {
    accessKey: '', secretKey: ''
  }) {
    const { accessKey, secretKey } = options

    this._request = new Request({ accessKey, secretKey })
  }

  /* Public APIs */

  /**
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Markets
   */
  markets () {
    return this._request.getPublic('/api/v2/markets')
  }

  /**
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Currencies
   */
  currencies () {
    return this._request.getPublic('/api/v2/currencies')
  }

  /**
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Tickers
   */
  tickers () {
    return this._request.getPublic('/api/v2/tickers')
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2TickersMarket
   */
  ticker (options = {}) {
    const errors = validate(options, {
      market: {
        type: String,
        required: true
      }
    })

    if (errors.length > 0) {
      return Promise.reject(new Error(errors))
    }

    return this._request.getPublic(`/api/v2/tickers/${options.market}`)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {number} [options.asksLimit=20] - returned sell orders limit
   * @param {number} [options.bidsLimit=20] - returned buy orders limit
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2OrderBook
   */
  orderBook (options) {
    return this._request.getPublic('/api/v2/order_book', options, optionsSchema.orderBook)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {number} [options.limit=300] - returned price levels limit
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Depth
   */
  depth (options) {
    return this._request.getPublic('/api/v2/depth', options, optionsSchema.depth)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {number} [options.limit=50] - returned trades limit, in range from 1 to 1000
   * @param {number} [options.from] - trade id, set ot return trades created after the trade
   * @param {number} [options.to] - trade id, set to return trades created before the trade
   * @param {number} [options.timestamp] - the seconds elapsed since Unix epoch, set to return trades executed before the time only
   * @param {string} [options.orderBy=desc] - order the trades by created time, 'asc' or 'desc'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Trades
   */
  marketTrades (options) {
    return this._request.getPublic('/api/v2/trades', options, optionsSchema.marketTrades)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {number} [options.limit=30] - returned data points limit
   * @param {number} [options.period=1] - time period of K line in minute, can be 1, 5, 15, 30, 60, 120, 240, 360, 720, 1440, 4320, 10080
   * @param {number} [options.timestamp] - the seconds elapsed since Unix epoch, set to return data after the timestamp only
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2K
   */
  k (options) {
    return this._request.getPublic('/api/v2/k', options, optionsSchema.k)
  }

  /**
   * @param {Object} options
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/public/getApiV2Timestamp
   */
  timestamp () {
    return this._request.getPublic('/api/v2/timestamp')
  }

  /**
   * Calibrate local time with system time
   *
   * @return {Promise}
   */
  calibrateTime () {
    return this.timestamp()
      .then((data) => {
        const systemTime = data * 1000
        const localTime = Date.now()
        const diff = localTime - systemTime

        /* Only calibrate local time when diff is larger than 30 seconds */
        if (Math.abs(diff) >= 30 * 1000) {
          this._request.setTimeDiff(diff)
          return Promise.resolve(`Local Time synced, diff was ${diff} ms.`)
        } else {
          return Promise.resolve('Local Time is synced.')
        }
      }).catch(() => {
        return Promise.reject(new Error('Sync local time failed, please try again.'))
      })
  }

  /* Private APIs */

  /**
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2MembersMe
   */
  me () {
    return this._request.getPrivate('/api/v2/members/me')
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currency] - unique currency id, check currencies() for available currencies
   * @param {string} [options.state] - deposit state filter
   * @param {number} [options.limit=3] - returned results limit, maximum 100
   * @param {number} [options.offset=0] - pagination offset
   * @param {number} [options.from] - target period start (Epoch time in seconds)
   * @param {number} [options.to] - target period end (Epoch time in seconds)
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Deposits
   */
  deposits (options) {
    return this._request.getPrivate('/api/v2/deposits', options, optionsSchema.deposits)
  }

  /**
   * @param {Object} options
   * @param {string} txid - unique transaction id
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Deposit
   */
  deposit (options) {
    return this._request.getPrivate('/api/v2/deposit', options, optionsSchema.deposit)
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currency] - unique currency id, check currencies() for available currencies
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2DepositAddress
   */
  depositAddresses (options) {
    return this._request.getPrivate('/api/v2/deposit_addresses', options, optionsSchema.depositAddresses)
  }

  /**
   * @param {Object} options
   * @param {string} options.currency - unique currency id, check currencies() for available currencies
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/postApiV2DepositAddresses
   */
  generateDepositAddresses (options) {
    return this._request.postPrivate('/api/v2/deposit_addresses', options, optionsSchema.generateDepositAddresses)
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currency] - unique currency id, check currencies() for available currencies
   * @param {string} [options.state] - withdrawal state filter
   * @param {number} [options.limit=3] - returned results limit, maximum 100
   * @param {number} [options.offset=0] - pagination offset
   * @param {number} [options.from] - target period start (Epoch time in seconds)
   * @param {number} [options.to] - target period end (Epoch time in seconds)
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Withdrawals
   */
  withdrawals (options) {
    return this._request.getPrivate('/api/v2/withdrawals', options, optionsSchema.withdrawals)
  }

  /**
   * @param {Object} options
   * @param {string} options.uuid - unique withdraw id
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Withdrawal
   */
  withdrawal (options) {
    return this._request.getPrivate('/api/v2/withdrawal', options, optionsSchema.withdrawal)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {string} [options.state] - order state filter
   * @param {number} [options.limit=3] - returned results limit, maximum 100
   * @param {number} [options.page=1] - specify the page of paginated results
   * @param {string} [options.orderBy=desc] - order in created time, 'desc' or 'asc'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Orders
   */
  orders (options) {
    return this._request.getPrivate('/api/v2/orders', options, optionsSchema.orders)
  }

  /**
   * @param {Object} options
   * @param {number} options.id - unique order id
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2Order
   */
  order (options) {
    return this._request.getPrivate('/api/v2/order', options, optionsSchema.order)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {number} [options.limit=50] - returned trades limit, in range from 1 to 1000
   * @param {number} [options.timestamp] - the seconds elapsed since Unix epoch, set to return trades executed before the time only
   * @param {number} [options.from] - trade id, set ot return trades created after the trade
   * @param {number} [options.to] - trade id, set to return trades created before the trade
   * @param {string} [options.orderBy=desc] - order the trades by created time, 'desc' or 'asc'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/getApiV2TradesMy
   */
  trades (options) {
    return this._request.getPrivate('/api/v2/trades/my', options, optionsSchema.trades)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {string} options.side - 'sell' or 'buy'
   * @param {string} options.volume - total amount to sell/buy, an order could be partially executed
   * @param {string} [options.price] - price of a unit, required for limit order
   * @param {string} [options.ord_type] - order type, 'limit' or 'market'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/postApiV2Orders
   */
  placeOrder (options) {
    return this._request.postPrivate('/api/v2/orders', options, optionsSchema.placeOrder)
  }

  /**
   * @param {Object} options
   * @param {string} options.market - unique market id, check markets() for available markets. Ex: 'btctwd'
   * @param {Object[]} options.orders - array of orders detail
   * @param {string} options.orders[].side - 'sell' or 'buy'
   * @param {string} options.orders[].volume - total amount to sell/buy, an order could be partially executed
   * @param {string} [options.orders[].price] - price of a unit, required for limit order
   * @param {string} [options.orders[].ord_type] - order type, 'limit' or 'market'
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/postApiV2OrdersMulti
   */
  placeOrders (options) {
    return this._request.postPrivate('/api/v2/orders/multi', options, optionsSchema.placeOrders)
  }

  /**
   * @param {Object} options
   * @param {string} [options.market] - specify market, ex: 'btctwd'. Cancel all markets if not set.
   * @param {string} [options.side] - 'sell' or 'buy'. Cancel both sides if not set.
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/postApiV2OrdersClear
   */
  cancelOrders (options) {
    return this._request.postPrivate('/api/v2/orders/clear', options, optionsSchema.cancelOrders)
  }

  /**
   * @param {Object} options
   * @param {number} options.id - unique order id
   *
   * @return {Promise}
   *
   * @see https://max.maicoin.com/documents/api_list#!/private/postApiV2OrderDelete
   */
  cancelOrder (options) {
    return this._request.postPrivate('/api/v2/order/delete', options, optionsSchema.cancelOrder)
  }
}

module.exports = RestV2

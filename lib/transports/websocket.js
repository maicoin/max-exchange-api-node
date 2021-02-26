const Decimal = require('decimal.js')

const WebSocket = require('ws')

const EventEmitter = require('events')

const webSocketURL = 'wss://max-stream.maicoin.com/ws'

const subscribeAction = 'subscribe'

class WebSocketAPI extends EventEmitter {
  /**
   * Initialize a WebSocket connection
   *
   * @constructor
   * @param {Object} options
   * @param {string} [options.accessKey]
   * @param {string} [options.secretKey]
   */
  constructor (options = {
    accessKey: '', secretKey: ''
  }) {
    super()

    const { accessKey, secretKey } = options
    this._accessKey = accessKey
    this._secretKey = secretKey
    this._subscriptions = []
  }

  connect () {
    // create the connection and setup the handlers
    this._ws = new WebSocket(webSocketURL, { })
    this._ws.on('open', this.handleOpen.bind(this))
    this._ws.on('message', this.handleMessage.bind(this))
  }

  subscribe (channel, market, options) {
    this._subscriptions.push({
      channel,
      market,
      depth: options.depth,
      resolution: options.resolution
    })
  }

  _sendSubscriptions (action) {
    this._ws.send(JSON.stringify({ action, subscriptions: this._subscriptions }))
  }

  handleOpen () {
    this._sendSubscriptions(subscribeAction)
  }

  handleMessage (body) {
    const obj = JSON.parse(body)

    // just to make the key alias here
    const { e: eventType, M: market, c: channel, T: millisecondTimestamp } = obj

    switch (eventType) {
      case 'subscribed':
        // emit the "subscribed" payload
        // {"e":"subscribed","s":[{"channel":"book","market":"btctwd","depth":10}],"i":"","T":1614299699417}
        this.emit('subscribed', {
          subscriptions: obj.s,
          time: new Date(millisecondTimestamp)
        })
        break

      case 'update':
      case 'snapshot':
        // "a": asks
        // "b": bids
        switch (channel) {
          case 'book':
            this.emit(channel + '.' + eventType, {
              market,
              bids: parsePriceVolumes(obj.b),
              asks: parsePriceVolumes(obj.a),
              time: new Date(millisecondTimestamp)
            })
            break

          case 'kline':
            break

          case 'trade':
            break
        }
        break
    }

    this.emit('raw', body)
  }
}

function parsePriceVolumes (pvs) {
  return pvs.map((pv) => { return { price: new Decimal(pv[0]), volume: new Decimal(pv[1]) } })
}

module.exports = WebSocketAPI

const WebSocket = require('ws')
const EventEmitter = require('events')
const crypto = require('crypto')

const WS_HOST = 'wss://max-ws.maicoin.com'
const KEEP_ALIVE_INTERVAL = 3000

/* Communicate with MAX Exchange Websocket API */
class WSV1 extends EventEmitter {
  /**
   * Initialize a websocket transport class.
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

    this._accessKey = options.accessKey
    this._secretKey = options.secretKey

    this._isOpen = false
    this._isAlive = false
    this._authenticated = false

    this._ws = null
    this._intervalId = null
  }

  /**
   * Opens a connection to the websocket API server. Will reject open if websocket is already
   * connected.
   *
   * @return {Promise}
   */
  open () {
    if (this._isOpen || this._ws !== null) {
      return Promise.reject(new Error('Websocket is already open.'))
    }

    this._ws = new WebSocket(WS_HOST)

    this._ws.on('open', this._handleOpen.bind(this))
    this._ws.on('open', this._handleConnection.bind(this))
    this._ws.on('message', this._handleMessage.bind(this))
    this._ws.on('close', this._handleClose.bind(this))
    this._ws.on('error', this._handleError.bind(this))

    return new Promise((resolve) => {
      this._ws.once('open', () => {
        resolve()
      })
    })
  }

  /**
   * Close a websocket connection when it was connected.
   *
   * @return {Promise}
   */
  close () {
    if (!this._isOpen || this._ws === null) {
      return Promise.reject(new Error('Websocket not open, cannot be closed.'))
    }

    return new Promise((resolve) => {
      this._ws.once('close', () => {
        this._isOpen = false
        this._ws = null

        resolve()
      })

      if (!this._isClosing) {
        this._isClosing = true
        this._ws.close()
      }
    })
  }

  /**
   * Subscribe Ticker
   * @param {string} market - unique market id, ex: 'btctwd'
   */
  subscribeTicker (market) {
    this._subscribe('ticker', { market })
  }

  /**
   * Unsbscribe Ticker
   * @param {string} market - unique market id, ex: 'btctwd'
   */
  unsubscribeTicker (market) {
    this._unsubscribe('ticker', { market })
  }

  /**
   * Subscribe Order Book
   * @param {string} market - unique market id, ex: 'btctwd'
   */
  subscribeOrderBook (market) {
    this._subscribe('orderbook', { market })
  }

  /**
   * Unsubscribe Order Book
   * @param {string} market - unique market id, ex: 'btctwd'
   */
  unsubscribeOrderBook (market) {
    this._unsubscribe('orderbook', { market })
  }

  /**
   * Subscribe Account
   */
  subscribeAccount () {
    this._auth()
  }

  /**
   * Unsubscribe Account
   */
  unsubscribeAccount () {
    this._unauth()
  }

  /* Private Methods */

  _send (message) {
    if (!this._isOpen || !this._ws) {
      return this.emit('error', new Error('Websocket is missing or not open.'))
    } else if (this._isClosing) {
      return this.emit('error', new Error('Websocket is closing.'))
    }

    this._ws.send(JSON.stringify(message))
  }

  _subscribe (channel, params) {
    this._send(Object.assign({}, {
      cmd: 'subscribe',
      channel
    }, { params }))
  }

  _unsubscribe (channel, params) {
    this._send(Object.assign({}, {
      cmd: 'unsubscribe',
      channel
    }, { params }))
  }

  _auth () {
    if (!this._accessKey || !this._secretKey) return new Error('Access key or secret key missing.')
    if (!this._challengeMsg) return new Error('Please wait for challenged event first.')
    if (this._authenticated) return new Error('Already authenticated.')

    const payload = `${this._accessKey}${this._challengeMsg}`
    const signature = crypto.createHmac('sha256', this._secretKey).update(payload).digest('hex')

    this._send({
      cmd: 'auth',
      access_key: this._accessKey,
      answer: signature
    })
  }

  _unauth () {
    if (!this._authenticated) return new Error('Please authenticate first.')

    this._send({ cmd: 'unauth' })
  }

  _handleOpen () {
    this._isOpen = true

    this.emit('open')
  }

  _handleMessage (message) {
    const messageObj = JSON.parse(message)

    this.emit('message', messageObj)

    const messageType = messageObj.info
    delete messageObj.info

    switch (messageType) {
    case 'challenge':
      this._handleChallenge(messageObj.msg)
      this.emit('challenged')
      break
    case 'authenticated':
      this._authenticated = true
      this.emit('authenticated')
      break
    case 'unauthenticated':
      this._authenticated = false
      this.emit('unauthenticated')
      break
    case 'ticker':
      this.emit('ticker', messageObj)
      break
    case 'orderbook':
      this.emit('orderbook', messageObj)
      break
    case 'trade':
      this.emit('trade', messageObj)
      break
    case 'account':
      this.emit('account', messageObj)
      break
    }
  }

  _handleClose () {
    this._isOpen = false
    this._ws = null
    this._isClosing = false
    this._authenticated = false

    if (this._intervalId) {
      clearInterval(this._intervalId)
      this._intervalId = null
    }

    this.emit('close')
  }

  _handleError (error) {
    this.emit('error', error)
  }

  _handleChallenge (msg) {
    this._challengeMsg = msg
  }

  _heartbeat () {
    this._isAlive = true
  }

  _handleConnection () {
    this._isAlive = true
    this._ws.on('pong', this._heartbeat.bind(this))

    this._intervalId = setInterval(this._ping.bind(this), KEEP_ALIVE_INTERVAL)
  }

  _ping () {
    if (this._ws && this._isAlive === false) {
      this._ws.terminate()
      return
    }

    this._isAlive = false
    this._ws.ping(() => {})
  }
}

module.exports = WSV1


const Book = require('./book')

class WebSocketBook extends Book {
  constructor (ws, market, depth = null) {
    super()

    this.market = market
    this._ws = ws
    this._ws.subscribe('book', market, { depth })
    this._ws.on('book.snapshot', this.handleSnapshot.bind(this))
    this._ws.on('book.update', this.handleUpdate.bind(this))
    this._onUpdates = []
  }

  onUpdate (cb) {
    this._onUpdates.push(cb)
  }

  handleUpdate (e) {
    const book = this
    this.update(e)
    this._onUpdates.forEach((cb) => cb(book))
  }

  handleSnapshot (e) {
    const book = this
    this.load(e)
    this._onUpdates.forEach((cb) => cb(book))
  }
}

module.exports = WebSocketBook

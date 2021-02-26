const WebSocketAPI = require('../lib/transports/websocket')
const RBTree = require('bintrees').RBTree

const ws = new WebSocketAPI({ accessKey: '', secretKey: '' })

class Book {
  constructor () {
    this._bids = new RBTree((a, b) => {
      return a.price.cmp(b.price)
    })

    this._asks = new RBTree((a, b) => {
      return a.price.cmp(b.price)
    })
  }

  load (snapshot) {
    snapshot.bids.forEach((pv) => this._bids.insert(pv))
    snapshot.asks.forEach((pv) => this._asks.insert(pv))
  }

  _priceVolumeUpdater (pvs) {
    return function (pv) {
      if (pv.volume.isZero()) {
        pvs.remove(pv)
      } else {
        const o = pvs.find(pv.price)
        if (o) {
          o.volume = pv.volume
        } else {
          pvs.insert(pv)
        }
      }
    }
  }

  update (update) {
    update.asks.forEach(this._priceVolumeUpdater(this._asks))
    update.bids.forEach(this._priceVolumeUpdater(this._bids))
  }

  spread () {
    const ask = this._asks.min()
    const bid = this._bids.max()
    return ask.price - bid.price
  }

  pretty () {
    let item
    const askIt = this._asks.iterator()
    while ((item = askIt.prev()) !== null) {
      console.log('ask ', item.price)
    }

    console.log('------------------', 'spread', this.spread().toFixed(2), '-------------------')

    const bidIt = this._bids.iterator()
    while ((item = bidIt.prev()) !== null) {
      console.log('bid ', item.price)
    }
  }
}

const book = new Book()

ws.subscribe('book', 'btctwd', { depth: 10 })
ws.on('book.snapshot', (e) => {
  console.log(e)

  book.load(e)
})

ws.on('book.update', (e) => {
  console.log(e)

  book.pretty()
})

// ws.on('raw', (body) => console.log(body) )
ws.connect()

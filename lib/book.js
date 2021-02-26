const RBTree = require('bintrees').RBTree

class Book {
  constructor () {
    this._bids = new RBTree((a, b) => {
      return a.price.cmp(b.price)
    })

    this._asks = new RBTree((a, b) => {
      return a.price.cmp(b.price)
    })
  }

  _priceVolumeUpdater (pvs) {
    return function (pv) {
      if (pv.volume.isZero()) {
        pvs.remove(pv)
      } else {
        const o = pvs.find(pv)
        if (o) {
          o.volume = pv.volume
        } else {
          pvs.insert(pv)
        }
      }
    }
  }

  load (snapshot) {
    snapshot.bids.forEach((pv) => this._bids.insert(pv))
    snapshot.asks.forEach((pv) => this._asks.insert(pv))
  }

  update (update) {
    update.asks.forEach(this._priceVolumeUpdater(this._asks))
    update.bids.forEach(this._priceVolumeUpdater(this._bids))
  }

  bestAsk () {
    return this._asks.min()
  }

  bestBid () {
    return this._bids.max()
  }

  spread () {
    const ask = this.bestAsk()
    const bid = this.bestBid()
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

module.exports = Book

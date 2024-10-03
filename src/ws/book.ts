import { RBTree } from 'bintrees';
import WebSocketAPI from './index.js';
import { OrderBookEvent, PriceVolume } from './types.js';

function comparePriceEntry(a: PriceVolume, b: PriceVolume): number {
  return a.price.toNumber() - b.price.toNumber();
}

class Book {
  private _bids: RBTree<PriceVolume>;
  private _asks: RBTree<PriceVolume>;

  constructor() {
    this._bids = new RBTree<PriceVolume>(comparePriceEntry);
    this._asks = new RBTree<PriceVolume>(comparePriceEntry);
  }

  private _priceVolumeUpdater(pvs: RBTree<PriceVolume>): (pv: PriceVolume) => void {
    return function(pv: PriceVolume): void {
      if (pv.volume.toNumber() === 0) {
        pvs.remove(pv);
      } else {
        const o = pvs.find(pv);
        if (o) {
          o.volume = pv.volume;
        } else {
          pvs.insert(pv);
        }
      }
    };
  }

  reset(): void {
    this._bids = new RBTree<PriceVolume>(comparePriceEntry);
    this._asks = new RBTree<PriceVolume>(comparePriceEntry);
  }

  load(snapshot: { bids: PriceVolume[], asks: PriceVolume[] }): void {
    this.reset();
    snapshot.bids.forEach((pv) => this._bids.insert(pv));
    snapshot.asks.forEach((pv) => this._asks.insert(pv));
  }

  update(update: { asks: PriceVolume[], bids: PriceVolume[] }): void {
    update.asks.forEach(this._priceVolumeUpdater(this._asks));
    update.bids.forEach(this._priceVolumeUpdater(this._bids));
  }

  bestAsk(): PriceVolume | null {
    return this._asks.min() || null;
  }

  bestBid(): PriceVolume | null {
    return this._bids.max() || null;
  }

  spread(): number {
    const ask = this.bestAsk();
    const bid = this.bestBid();
    return ask && bid ? ask.price.toNumber() - bid.price.toNumber() : 0;
  }

  pretty(): void {
    let item: PriceVolume | null;
    const askIt = this._asks.iterator();
    while ((item = askIt.prev()) !== null) {
      console.log('ask ', item.price);
    }

    console.log('------------------', 'spread', this.spread().toFixed(2), '-------------------');

    const bidIt = this._bids.iterator();
    while ((item = bidIt.prev()) !== null) {
      console.log('bid ', item.price);
    }
  }
}


class WebSocketBook extends Book {
  private market: string;
  private _ws: WebSocketAPI;
  private _onUpdates: ((book: WebSocketBook) => void)[];

  constructor(ws: WebSocketAPI, market: string, depth: number | undefined = undefined) {
    super();

    this.market = market;
    this._ws = ws;
    this._ws.subscribe('book', market, { depth });
    this._ws.on('book.snapshot', this.handleSnapshot.bind(this));
    this._ws.on('book.update', this.handleUpdate.bind(this));
    this._onUpdates = [];
  }

  onUpdate(cb: (book: WebSocketBook) => void): void {
    this._onUpdates.push(cb);
  }

  handleUpdate(e: OrderBookEvent): void {
    this.update(e);
    this._onUpdates.forEach((cb) => cb(this));
  }

  handleSnapshot(e: OrderBookEvent): void {
    this.load(e);
    this._onUpdates.forEach((cb) => cb(this));
  }
}

export { Book, WebSocketBook };

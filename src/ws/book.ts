import { RBTree } from 'bintrees';

import { PriceVolume } from '../rest/types.js';

import { OrderBookEvent } from './types.js';

import WebSocketAPI from './index.js';

function comparePriceEntry(a: PriceVolume, b: PriceVolume): number {
  return a.price.toNumber() - b.price.toNumber();
}

export default class Book {
  #bids: RBTree<PriceVolume>;
  #asks: RBTree<PriceVolume>;

  constructor() {
    this.#bids = new RBTree<PriceVolume>(comparePriceEntry);
    this.#asks = new RBTree<PriceVolume>(comparePriceEntry);
  }

  #priceVolumeUpdater(pvs: RBTree<PriceVolume>): (pv: PriceVolume) => void {
    return function (pv: PriceVolume): void {
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
    this.#bids = new RBTree<PriceVolume>(comparePriceEntry);
    this.#asks = new RBTree<PriceVolume>(comparePriceEntry);
  }

  load(snapshot: { bids: PriceVolume[]; asks: PriceVolume[] }): void {
    this.reset();
    snapshot.bids.forEach((pv) => this.#bids.insert(pv));
    snapshot.asks.forEach((pv) => this.#asks.insert(pv));
  }

  update(update: { asks: PriceVolume[]; bids: PriceVolume[] }): void {
    update.asks.forEach(this.#priceVolumeUpdater(this.#asks));
    update.bids.forEach(this.#priceVolumeUpdater(this.#bids));
  }

  bestAsk(): PriceVolume | null {
    return this.#asks.min() || null;
  }

  bestBid(): PriceVolume | null {
    return this.#bids.max() || null;
  }

  spread(): number {
    const ask = this.bestAsk();
    const bid = this.bestBid();
    return ask && bid ? ask.price.toNumber() - bid.price.toNumber() : 0;
  }

  pretty(): void {
    let item: PriceVolume | null;
    const askIt = this.#asks.iterator();
    while ((item = askIt.prev()) !== null) {
      console.log('ask ', item.price);
    }

    console.log('------------------', 'spread', this.spread().toFixed(2), '-------------------');

    const bidIt = this.#bids.iterator();
    while ((item = bidIt.prev()) !== null) {
      console.log('bid ', item.price);
    }
  }
}

class WebSocketBook extends Book {
  #market: string;

  #ws: WebSocketAPI;

  #onUpdates: ((book: WebSocketBook) => void)[];

  constructor(ws: WebSocketAPI, market: string, depth: number | undefined = undefined) {
    super();

    this.#market = market;
    this.#ws = ws;
    this.#ws.subscribe('book', market, { depth });
    this.#ws.on('book.snapshot', this.handleSnapshot.bind(this));
    this.#ws.on('book.update', this.handleUpdate.bind(this));
    this.#onUpdates = [];
  }

  onUpdate(cb: (book: WebSocketBook) => void): void {
    this.#onUpdates.push(cb);
  }

  handleUpdate(e: OrderBookEvent): void {
    this.update(e);
    this.#onUpdates.forEach((cb) => cb(this));
  }

  handleSnapshot(e: OrderBookEvent): void {
    this.load(e);
    this.#onUpdates.forEach((cb) => cb(this));
  }
}

export { Book, WebSocketBook };

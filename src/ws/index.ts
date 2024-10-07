import Decimal from 'decimal.js/decimal.mjs';
import crypto from 'crypto';
import WebSocket from 'ws';
import { z } from 'zod';
import { EventEmitter } from 'events';
import { WEBSOCKET_URL } from '../config.js';
import type { Debt, ErrorResponse, IndexPrice, MarketStatus, Order, OrderBookEvent, Subscription, TradeEvent, UserBalance, UserTrade, WebSocketAPIOptions, WebSocketEvents } from './types.js';
import { Trade } from './types.js';
import { ChannelSchema, FilterTypeSchema, SubscriptionSchema, SubscriptionOptionalParam, FilterType } from './schema.js';

class WebSocketAPI extends EventEmitter {
  on<K extends keyof WebSocketEvents>(eventName: K, listener: (arg: WebSocketEvents[K]) => void): this {
    return super.on(eventName, listener);
  }

  emit<K extends keyof WebSocketEvents>(eventName: K, value: WebSocketEvents[K]): boolean {
    return super.emit(eventName, value);
  }

  #accessKey: string;
  #secretKey: string;
  #subscriptions: Subscription[];
  #pingInterval: NodeJS.Timeout | null;
  #ws: WebSocket | null;
  #filters: FilterType[];
  #orderbooks: { [market: string]: any };
  #autoReconnect: boolean;
  #reconnectInterval: number;
  #maxReconnectAttempts: number;
  #reconnectAttempts: number;
  #isReconnecting: boolean;

  /**
   * Create a new WebSocketAPI instance.
   * @param options - The options for the WebSocket API.
   */
  constructor(options: WebSocketAPIOptions) {
    super();
    const {
      accessKey = '',
      secretKey = '',
      autoReconnect = false,
      reconnectInterval = 5000,
      maxReconnectAttempts = 5
    } = options;
    this.#accessKey = accessKey;
    this.#secretKey = secretKey;
    this.#subscriptions = [];
    this.#pingInterval = null;
    this.#ws = null;
    this.#filters = [];
    this.#orderbooks = {};
    this.#autoReconnect = autoReconnect;
    this.#reconnectInterval = reconnectInterval;
    this.#maxReconnectAttempts = maxReconnectAttempts;
    this.#reconnectAttempts = 0;
    this.#isReconnecting = false;
  }

  /**
   * Establish a connection to the WebSocket server.
   */
  public connect(): void {
    this.#ws = new WebSocket(WEBSOCKET_URL);
    this.#ws.on('open', this.#handleOpen.bind(this));
    this.#ws.on('message', this.#handleMessage.bind(this));
    this.#ws.on('close', this.#handleClose.bind(this));
    this.#ws.on('error', this.#handleError.bind(this));

    this.#pingInterval = setInterval(() => {
      if (this.#ws?.readyState === WebSocket.OPEN) {
        this.#ws.ping('test');
      }
    }, 30000);

    this.#ws.on('pong', (data: Buffer) => {
      console.log('Server pong:', data.toString());
    });
  }

  /**
   * Disconnect from the WebSocket server.
   */
  public disconnect(): void {
    this.#autoReconnect = false;
    this.#closeConnection();
  }

  #closeConnection(): void {
    if (this.#ws) {
      this.#ws.close();
    }
    if (this.#pingInterval) {
      clearInterval(this.#pingInterval);
    }
    this.#cleanup();
  }

  #cleanup(): void {
    this.#subscriptions = [];
    this.#orderbooks = {};
    this.#filters = [];
  }

  /**
   * Get the current connection state.
   * @returns The current WebSocket connection state.
   */
  public getConnectionState(): number {
    return this.#ws ? this.#ws.readyState : WebSocket.CLOSED;
  }

  /**
   * Subscribe to a specific channel for a given market.
   * @param channel - The channel to subscribe to ('book', 'trade', 'kline', 'ticker', 'market_status', 'pool_quota', or 'user').
   * @param market - The market to subscribe to.
   * @param options - Additional options for the subscription.
   */
  public subscribe(
    channel: z.infer<typeof ChannelSchema>,
    market: string,
    options: SubscriptionOptionalParam = {}): void {
    const subscription = SubscriptionSchema.parse({ channel, market, ...options });
    this.#subscriptions.push(subscription);

    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      this.#sendSubscriptions('sub');
    }
  }
  /**
   * Unsubscribe from a specific channel for a given market.
   * @param channel - The channel to unsubscribe from.
   * @param market - The market to unsubscribe from.
   * @param options - Additional options for the unsubscription.
   */
  public unsubscribe(
    channel: z.infer<typeof ChannelSchema>,
    market: string,
    options: SubscriptionOptionalParam = {}
  ): void {
    const subscription = SubscriptionSchema.parse({ channel, market, ...options });
    this.#subscriptions = this.#subscriptions.filter(sub =>
      JSON.stringify(sub) !== JSON.stringify(subscription)
    );

    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.send(JSON.stringify({
        action: 'unsub',
        subscriptions: [subscription]
      }));
    }
  }

  /**
   * Set filters for private channel subscriptions.
   * @param filters - An array of filter types to apply.
   */
  public setFilters(filters: FilterType[]): void {
    this.#filters = z.array(FilterTypeSchema).parse(filters);
  }


  #sendSubscriptions(action: string): void {
    if (this.#subscriptions.length > 0 && this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.send(JSON.stringify({ action, subscriptions: this.#subscriptions }));
    }
  }

  #handleOpen(): void {
    this.#reconnectAttempts = 0;
    if (this.#secretKey && this.#accessKey) {
      this.#sendAuth();
    }
    this.#sendSubscriptions('sub');
    this.emit('open', undefined);
  }

  #sendAuth(): void {
    const nonce = Date.now();
    const hmac = crypto.createHmac('sha256', this.#secretKey);
    const signature = hmac.update(nonce.toString()).digest('hex');
    const authMessage: any = {
      action: 'auth',
      apiKey: this.#accessKey,
      nonce,
      signature
    };
    if (this.#filters.length > 0) {
      authMessage.filters = this.#filters;
    }
    this.#ws?.send(JSON.stringify(authMessage));
  }

  #handleMessage(body: WebSocket.Data): void {
    try {
      const obj = JSON.parse(body.toString());
      this.emit('raw', obj);
      // TODO eventType replace
      const { e: eventType, c: channel, M: market, T: timestamp } = obj;

      switch (`${channel || ''}.${eventType}`) {
        case '.error':
          this.#handleErrorEvent(obj);
          break;
        case '.authenticated':
          this.#handleAuthenticatedEvent(obj);
          break;
        case '.subscribed':
        case '.unsubscribed':
          this.#handleSubscriptionEvent(eventType, obj);
          break;
        case 'book.snapshot':
        case 'book.update':
          this.#handleBookEvent(eventType, obj);
          break;
        case 'trade.snapshot':
        case 'trade.update':
          this.#handleTradeEvent(eventType, obj);
          break;
        case 'kline.snapshot':
        case 'kline.update':
          this.#handleKlineEvent(eventType, obj);
          break;
        case 'ticker.snapshot':
        case 'ticker.update':
          this.#handleTickerEvent(eventType, obj);
          break;
        case 'market_status.snapshot':
        case 'market_status.update':
          this.#handleMarketStatusEvent(eventType, obj);
          break;
        case 'pool_quota.snapshot':
        case 'pool_quota.update':
          this.#handlePoolQuotaEvent(eventType, obj);
          break;
        case 'user.order_snapshot':
        case 'user.order_update':
        case 'user.mwallet_order_snapshot':
        case 'user.mwallet_order_update':
          this.#handleUserOrderEvent(eventType, obj);
          break;
        case 'user.trade_snapshot':
        case 'user.trade_update':
        case 'user.mwallet_trade_snapshot':
        case 'user.mwallet_trade_update':
          this.#handleUserTradeEvent(eventType, obj);
          break;
        case 'user.account_snapshot':
        case 'user.account_update':
        case 'user.mwallet_account_snapshot':
        case 'user.mwallet_account_update':
          this.#handleUserAccountEvent(eventType, obj);
          break;
        case 'user.ad_ratio_snapshot':
        case 'user.ad_ratio_update':
          this.#handleUserAdRatioEvent(eventType, obj);
          break;
        case 'user.borrowing_snapshot':
        case 'user.borrowing_update':
          this.#handleUserBorrowingEvent(eventType, obj);
          break;
        default:
          console.warn(`Unhandled event type: ${channel}.${eventType}`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      this.emit('error', new Error('Failed to parse message'));
    }
  }

  #handleErrorEvent(data: ErrorResponse): void {
    const errorCode = data.co ? parseInt(data.co) : null;
    let errorMessage = data.E[0];

    switch (errorCode) {
      case 1004:
        errorMessage = 'Invalid action';
        break;
      case 1005:
        errorMessage = 'Invalid JSON';
        break;
      case 1006:
        errorMessage = 'Invalid nonce (difference of 30 seconds or more)';
        break;
      case 1007:
        errorMessage = 'Authentication failed';
        break;
      case 1012:
        errorMessage = 'Nonce has already been used';
        break;
      default:
      // Use the error message from the server
    }

    this.emit('error', {
      message: errorMessage,
      code: errorCode,
      time: new Date(data.T)
    });
  }

  #handleAuthenticatedEvent(data: any): void {
    this.emit('authenticated', {
      time: new Date(data.T)
    });
  }

  #handleSubscriptionEvent(eventType: 'subscribed' | 'unsubscribed', data: any): void {
    this.emit(`.${eventType}`, {
      subscriptions: data.s,
      time: new Date(data.T)
    });
  }

  #handleBookEvent(eventType: 'snapshot' | 'update', data: any): void {
    const book: OrderBookEvent = {
      market: data.M,
      bids: data.b.map(([p, v]: string[]) => ({
        price: new Decimal(p),
        volume: new Decimal(v)
      })),
      asks: data.a.map(([p, v]: string[]) => ({
        price: new Decimal(p),
        volume: new Decimal(v)
      })),
      time: new Date(data.T),
      firstUpdateId: data.fi,
      lastUpdateId: data.li,
      version: data.v
    };

    this.emit(`book.${eventType}`, book);

    if (eventType === 'snapshot') {
      this.#orderbooks[data.M] = {
        bids: new Map(book.bids.map(b => [b.price.toString(), b])),
        asks: new Map(book.asks.map(a => [a.price.toString(), a])),
        lastUpdateId: book.lastUpdateId,
        version: book.version
      };
    } else if (eventType === 'update') {
      const localBook = this.#orderbooks[data.M];
      if (localBook) {
        if (localBook.version === book.version && book.firstUpdateId <= localBook.lastUpdateId + 1 && book.lastUpdateId >= localBook.lastUpdateId + 1) {
          this.#updateOrderBook(localBook.bids, book.bids);
          this.#updateOrderBook(localBook.asks, book.asks);
          localBook.lastUpdateId = book.lastUpdateId;
        } else {
          console.warn(`Order book continuity break for ${data.M}, resubscribing...`);
          this.unsubscribe('book', data.M);
          this.subscribe('book', data.M);
        }
      } else {
        console.warn(`No local order book for ${data.M}, resubscribing...`);
        this.subscribe('book', data.M); // TODO check
      }
    }
  }

  #updateOrderBook(bookSide: Map<string, { price: Decimal, volume: Decimal }>, updates: { price: Decimal, volume: Decimal }[]): void {
    for (const update of updates) {
      const priceStr = update.price.toString();
      if (update.volume.isZero()) {
        bookSide.delete(priceStr);
      } else {
        bookSide.set(priceStr, update);
      }
    }
  }

  #handleTradeEvent(eventType: 'update' | 'snapshot', data: any): void {
    this.emit(`trade.${eventType}`, {
      market: data.M,
      trades: data.t.map((t: any): Trade => ({
        price: new Decimal(t.p),
        volume: new Decimal(t.v),
        side: t.tr,
        createdAt: new Date(t.T)
      })),
      time: new Date(data.T)
    });
  }

  #handleKlineEvent(eventType: 'update' | 'snapshot', data: any): void {
    this.emit(`kline.${eventType}`, {
      market: data.M,
      startTime: new Date(data.k.ST),
      endTime: new Date(data.k.ET),
      resolution: data.k.R,
      open: new Decimal(data.k.O),
      high: new Decimal(data.k.H),
      low: new Decimal(data.k.L),
      close: new Decimal(data.k.C),
      volume: new Decimal(data.k.v),
      lastTradeId: data.k.ti,
      closed: data.k.x,
      time: new Date(data.T)
    });
  }

  #handleTickerEvent(eventType: 'update' | 'snapshot', data: any): void {
    this.emit(`ticker.${eventType}`, {
      market: data.tk.M,
      open: new Decimal(data.tk.O),
      high: new Decimal(data.tk.H),
      low: new Decimal(data.tk.L),
      close: new Decimal(data.tk.C),
      volume: new Decimal(data.tk.v),
      volumeInBTC: new Decimal(data.tk.V),
      time: new Date(data.T)
    });
  }

  #handleMarketStatusEvent(eventType: 'update' | 'snapshot', data: any): void {
    this.emit(`market_status.${eventType}`, {
      marketStatuses: data.ms.map((ms: any): MarketStatus => ({
        id: ms.M,
        status: ms.st,
        baseUnit: ms.bu,
        baseUnitPrecision: ms.bup,
        minBaseAmount: new Decimal(ms.mba),
        quoteUnit: ms.qu,
        quoteUnitPrecision: ms.qup,
        minQuoteAmount: new Decimal(ms.mqa),
        mWalletSupported: ms.mws
      })),
      time: new Date(data.T)
    });
  }

  #handlePoolQuotaEvent(eventType: 'update' | 'snapshot', data: any): void {
    this.emit(`pool_quota.${eventType}`, {
      currency: data.qta.cu,
      available: new Decimal(data.qta.av),
      updatedAt: new Date(data.qta.TU),
      time: new Date(data.T)
    });
  }

  #handleUserOrderEvent(eventType: 'order_snapshot' | 'order_update' | 'mwallet_order_snapshot' | 'mwallet_order_update', data: any): void {
    this.emit(`user.${eventType}`, {
      time: new Date(data.T),
      orders: data.o.map((o: any): Order => ({
        id: o.i,
        side: o.sd,
        ordType: o.ot,
        price: new Decimal(o.p),
        stopPrice: new Decimal(o.sp),
        avgPrice: new Decimal(o.ap),
        volume: new Decimal(o.v),
        remainingVolume: new Decimal(o.rv),
        executedVolume: new Decimal(o.ev),
        state: o.S,
        market: o.M,
        tradeCount: o.tc,
        createdAt: new Date(o.T),
        updatedAt: new Date(o.TU),
        groupId: o.gi,
        clientOid: o.ci
      }))
    });
  }

  #handleUserTradeEvent(eventType: 'trade_snapshot' | 'trade_update' | 'mwallet_trade_snapshot' | 'mwallet_trade_update', data: any): void {
    this.emit(`user.${eventType}`, {
      time: new Date(data.T),
      trades: data.t.map((t: any): UserTrade => ({
        id: t.i,
        market: t.M,
        side: t.sd,
        price: new Decimal(t.p),
        volume: new Decimal(t.v),
        fee: t.f ? new Decimal(t.f) : null,
        feeCurrency: t.fc,
        feeDiscounted: t.fd,
        funds: new Decimal(t.fn),
        createdAt: new Date(t.T),
        updatedAt: new Date(t.TU),
        maker: t.m,
        orderId: t.oi,
      }))
    });
  }

  #handleUserAccountEvent(eventType: 'account_snapshot' | 'account_update' | 'mwallet_account_snapshot' | 'mwallet_account_update', data: any): void {
    this.emit(`user.${eventType}`,
      {
        time: new Date(data.T),
        balances: data.B.map((b: any): UserBalance => ({
          currency: b.cu,
          available: new Decimal(b.av),
          locked: new Decimal(b.l),
          staked: b.stk ? new Decimal(b.stk) : null,
          updatedAt: new Date(b.TU)
        }))
      });
  }

  #handleUserAdRatioEvent(eventType: 'ad_ratio_snapshot' | 'ad_ratio_update', data: any): void {
    this.emit(`user.${eventType}`, {
      adRatio: new Decimal(data.ad.ad),
      assetInUsdt: new Decimal(data.ad.as),
      debtInUsdt: new Decimal(data.ad.db),
      indexPrices: data.ad.idxp.map((ip: any): IndexPrice => ({
        market: ip.M,
        price: new Decimal(ip.p)
      })),
      updatedAt: new Date(data.ad.TU),
      time: new Date(data.T),
    });
  }

  #handleUserBorrowingEvent(eventType: 'borrowing_snapshot' | 'borrowing_update', data: any): void {
    this.emit(`user.${eventType}`, {
      time: new Date(data.T),
      debts: data.db.map((d: any): Debt => ({
        currency: d.cu,
        debtPrincipal: new Decimal(d.dbp),
        debtInterest: new Decimal(d.dbi),
        updatedAt: new Date(d.TU)
      }))
    });
  }

  #handleClose(event: CloseEvent): void {
    this.emit('close', event);

    if (this.#pingInterval) {
      clearInterval(this.#pingInterval);
    }

    if (this.#autoReconnect && !this.#isReconnecting) {
      this.#attemptReconnect();
    } else {
      this.#cleanup();
    }
  }

  #handleError(error: Error): void {
    this.emit('error', error);
  }

  #attemptReconnect(): void {
    if (this.#reconnectAttempts < this.#maxReconnectAttempts) {
      this.#isReconnecting = true;
      this.#reconnectAttempts++;
      console.log(`Attempting to reconnect... (Attempt ${this.#reconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.#reconnectInterval);
    } else {
      console.log('Max reconnection attempts reached. Giving up.');
      this.#isReconnecting = false;
      this.#cleanup();
    }
  }
}

export default WebSocketAPI;

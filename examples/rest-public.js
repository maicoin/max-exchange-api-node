import { MAX } from '../dist/index.js';

if (!process.env.MAX_API_KEY || !process.env.MAX_API_SECRET) {
    console.error('env vars MAX_API_KEY and MAX_API_SECRET are required')
    process.exit(-1)
}

const max = new MAX({ accessKey: process.env.MAX_API_KEY, secretKey: process.env.MAX_API_SECRET })

try {
    // Example 1: Get server time
    console.log('Example 1: Get server time');
    const serverTime = await max.rest.getTimestamp();
    console.log(`Server time: ${serverTime.timestamp.toISOString()}\n`);

    // Example 2: Get all markets
    console.log('Example 2: Get all markets');
    const markets = await max.rest.getMarkets();
    console.log(`Total markets: ${markets.length}`);
    console.log(`First market: ${JSON.stringify(markets[0], null, 2)}\n`);

    // Example 3: Get ticker for a specific market
    const market = 'btcusdt';
    console.log(`Example 3: Get ticker for ${market}`);
    const ticker = await max.rest.getTicker({ market });
    console.log(`Ticker: ${JSON.stringify(ticker, null, 2)}\n`);

    // Example 4: Get order book for a specific market
    console.log(`Example 4: Get order book for ${market}`);
    const orderBook = await max.rest.getDepth({ market });
    console.log(`Order book timestamp: ${orderBook.timestamp}`);
    console.log(`Top bid: ${JSON.stringify(orderBook.bids[0], null, 2)}`);
    console.log(`Top ask: ${JSON.stringify(orderBook.asks[0], null, 2)}\n`);

    // Example 5: Get recent trades for a specific market
    console.log(`Example 5: Get recent trades for ${market}`);
    const trades = await max.rest.getPublicTrades({ market });
    console.log(`Recent trades: ${JSON.stringify(trades.slice(0, 3), null, 2)}\n`);

    // Example 6: Get K-line data for a specific market
    console.log(`Example 6: Get K-line data for ${market}`);
    const kline = await max.rest.getKLine({ market, period: 5, limit: 5 });
    console.log(`K-line data: ${JSON.stringify(kline, null, 2)}\n`);

    // Example 7: Get all tickers
    console.log('Example 7: Get all tickers');
    const tickers = await max.rest.getTickers({ markets: [market, 'ethusdt'] });
    console.log(`Total tickers: ${tickers.length}`);
    console.log(`First ticker: ${JSON.stringify(tickers[0], null, 2)}\n`);
    console.log(`Second ticker: ${JSON.stringify(tickers[1], null, 2)}\n`);

} catch (error) {
    console.error('An error occurred:', error);
}
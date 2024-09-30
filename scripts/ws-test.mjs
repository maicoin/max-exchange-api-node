import { WebSocket } from '../dist/index.mjs'

const ws = new WebSocket({
  accessKey: process.env.MAX_ACCESSKEY_PROD,
  secretKey: process.env.MAX_SECRET_PROD,
});

// Subscribe to multiple channels
ws.subscribe('kline', 'btctwd', { resolution: '1m' });
ws.subscribe('book', 'ethtwd', { depth: 5 });
ws.subscribe('trade', 'maxtwd');
ws.subscribe('ticker', 'usdttwd');

// Set filters for private channels
ws.setFilters(['order', 'trade', 'account']);

// Event handlers
ws.on('open', () => {
  console.log('WebSocket connection opened');
});

ws.on('authenticated', (e) => {
  console.log('Authenticated:', e);
});

ws.on('subscribed', (e) => {
  console.log('Subscribed:', e);
});

ws.on('kline.snapshot', (e) => {
  console.log('Kline Snapshot:', e);
});

ws.on('kline.update', (e) => {
  console.log('Kline Update:', e);
});

ws.on('book.snapshot', (e) => {
  console.log('Order Book Snapshot:', e);
});

ws.on('book.update', (e) => {
  console.log('Order Book Update:', e);
});

ws.on('trade.snapshot', (e) => {
  console.log('Trade Snapshot:', e);
});

ws.on('trade.update', (e) => {
  console.log('Trade Update:', e);
});

ws.on('ticker.snapshot', (e) => {
  console.log('Ticker Snapshot:', e);
});

ws.on('ticker.update', (e) => {
  console.log('Ticker Update:', e);
});

ws.on('user.order_snapshot', (e) => {
  console.log('User Order Snapshot:', e);
});

ws.on('user.order_update', (e) => {
  console.log('User Order Update:', e);
});

ws.on('user.trade_snapshot', (e) => {
  console.log('User Trade Snapshot:', e);
});

ws.on('user.trade_update', (e) => {
  console.log('User Trade Update:', e);
});

ws.on('user.account_snapshot', (e) => {
  console.log('User Account Snapshot:', e);
});

ws.on('user.account_update', (e) => {
  console.log('User Account Update:', e);
});

ws.on('error', (error) => {
  console.error('WebSocket Error:', error);
});

ws.on('close', (event) => {
  console.log('WebSocket connection closed:', event);
});

// Optional: Log all raw messages
ws.on('raw', (body) => {
  //console.log('Raw message:', body);
});

// Connect to the WebSocket server
ws.connect();

// // After 30 seconds, unsubscribe from one channel and add a new one
// setTimeout(() => {
//   console.log('Unsubscribing from btctwd kline and subscribing to ltctwd ticker');
//   ws.unsubscribe('kline', 'btctwd');
//   ws.subscribe('ticker', 'ltctwd');
// }, 30000);

// // After 60 seconds, test the reconnection by forcibly closing the connection
// setTimeout(() => {
//   console.log('Testing reconnection...');
//   ws.disconnect();
//   // The WebSocket should automatically attempt to reconnect
// }, 60000);

// // Keep the script running
// process.on('SIGINT', () => {
//   console.log('Caught interrupt signal');
//   ws.disconnect();
//   process.exit();
// });

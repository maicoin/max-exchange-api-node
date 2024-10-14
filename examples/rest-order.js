import readline from 'readline';

import { MAX } from '../dist/index.js';

if (!process.env.MAX_API_KEY || !process.env.MAX_API_SECRET) {
  console.error('env vars MAX_API_KEY and MAX_API_SECRET are required')
  process.exit(-1)
}

const max = new MAX({ accessKey: process.env.MAX_API_KEY, secretKey: process.env.MAX_API_SECRET })

const market = 'btcusdt';

// Function to get user confirmation
function getUserConfirmation(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'ok');
    });
  });
}

try {
  // Step 1: Get account balances
  console.log('Step 1: Get account balances');
  const accounts = await max.rest.spotWallet.getAccounts({});
  const btcBalance = accounts.find(a => a.currency === 'btc')?.balance.toString() || '0';
  const usdtBalance = accounts.find(a => a.currency === 'usdt')?.balance.toString() || '0';
  console.log(`BTC balance: ${btcBalance}`);
  console.log(`USDT balance: ${usdtBalance}\n`);

  // Step 2: Get current market price
  console.log('Step 2: Get current market price');
  const ticker = await max.rest.getTicker({ market });
  const currentPrice = ticker.last.toNumber();
  console.log(`Current ${market} price: ${currentPrice}\n`);

  // Step 3: Place a limit buy order
  console.log('Step 3: Place a limit buy order');
  const buyPrice = (currentPrice * 0.99).toFixed(2); // 1% below current price
  const buyVolume = '0.0001'; // Buy 0.001 BTC
  
  const buyConfirmed = await getUserConfirmation(
    `Are you sure you want to place a limit buy order for ${buyVolume} BTC at ${buyPrice} USDT? Type 'ok' to confirm: `
  );

  if (buyConfirmed) {
    const buyOrder = await max.rest.spotWallet.submitOrder({
      market,
      side: 'buy',
      volume: buyVolume,
      price: buyPrice,
      ord_type: 'limit',
    });
    console.log(`Buy order placed: ${JSON.stringify(buyOrder, null, 2)}\n`);
  } else {
    console.log('Buy order cancelled by user.\n');
  }

  // Step 4: Get open orders
  console.log('Step 4: Get open orders');
  const openOrders = await max.rest.spotWallet.getOpenOrders({ market });
  console.log(`Open orders: ${JSON.stringify(openOrders, null, 2)}\n`);

  // Step 5: Cancel the buy order (if it exists)
  if (openOrders.length > 0) {
    console.log('Step 5: Cancel the buy order');
    const cancelConfirmed = await getUserConfirmation(
      'Are you sure you want to cancel the open order(s)? Type \'ok\' to confirm: '
    );

    if (cancelConfirmed) {
      for (const order of openOrders) {
        const cancelResult = await max.rest.cancelOrder({ id: order.id });
        console.log(`Cancel result: ${JSON.stringify(cancelResult, null, 2)}\n`);
      }
    } else {
      console.log('Order cancellation skipped by user.\n');
    }
  }

  // Step 6: Place a market sell order
  console.log('Step 6: Place a market sell order');
  const sellVolume = '0.001'; // Sell 0.0001 BTC
  
  const sellConfirmed = await getUserConfirmation(
    `Are you sure you want to place a market sell order for ${sellVolume} BTC? Type 'ok' to confirm: `
  );

  if (sellConfirmed) {
    const sellOrder = await max.rest.spotWallet.submitOrder({
      market,
      side: 'sell',
      volume: sellVolume,
      ord_type: 'market',
    });
    console.log(`Sell order placed: ${JSON.stringify(sellOrder, null, 2)}\n`);
  } else {
    console.log('Sell order cancelled by user.\n');
  }

  // Step 7: Get trade history
  console.log('Step 7: Get trade history');
  const tradeHistory = await max.rest.spotWallet.getTrades({ market, limit: 5 });
  console.log(`Recent trades: ${JSON.stringify(tradeHistory, null, 2)}\n`);

} catch (error) {
  console.error('An error occurred:', error);
}
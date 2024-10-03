import { Rest} from '../dist/index.js';

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const FG_RED = '\x1b[31m';
const FG_GREEN = '\x1b[32m';
const FG_YELLOW = '\x1b[33m';
const FG_CYAN = '\x1b[36m';

function logSection(message) {
  console.log('\n' + '='.repeat(50));
  console.log(`${BRIGHT}${FG_CYAN}${message}${RESET}`);
  console.log('='.repeat(50));
}

const sections = [
  {
    name: 'markets',
    run: async (maxV3) => {
      return await maxV3.getMarkets();
    }
  },
  {
    name: 'currencies',
    run: async (maxV3) => {
      return await maxV3.getCurrencies();
    }
  },
  {
    name: 'openOrders',
    run: async (maxV3) => {
      return await maxV3.getOpenOrders('spot', { market: 'btctwd' });
    }
  },
  {
    name: 'closedOrders',
    run: async (maxV3) => {
      return await maxV3.getCloseOrders('spot', { market: 'btctwd' });
    }
  },
  {
    name: 'submitOrder',
    run: async (maxV3) => {
      return await maxV3.submitOrder('spot', {
        market: 'btctwd',
        side: 'buy',
        volume: '0.01',
        price: '30000'
      });
    }
  },
  {
    name: 'cancelOrder',
    run: async (maxV3) => {
      // 注意：這裡假設有一個訂單ID。實際使用時需要替換為真實的訂單ID
      return await maxV3.cancelOrder({ id: 2351029159 });
    }
  },
  {
    name: 'cancelAllOrders',
    run: async (maxV3) => {
      return await maxV3.cancelAllOrders('spot', { market: 'btctwd' });
    }
  },
  {
    name: 'getOrder',
    run: async (maxV3) => {
      // 注意：這裡假設有一個訂單ID。實際使用時需要替換為真實的訂單ID
      return await maxV3.getOrder({ id: 2351029159 });
    }
  },
  {
    name: 'getOrderTrades',
    run: async (maxV3) => {
      // 注意：這裡假設有一個訂單ID。實際使用時需要替換為真實的訂單ID
      return await maxV3.getOrderTrades({ orderId: 2351029159 });
    }
  },
  {
    name: 'indexPrices',
    run: async (maxV3) => {
      return await maxV3.getIndexPrices();
    }
  },
  {
    name: 'historicalIndexPrices',
    run: async (maxV3) => {
      const startTime = Date.now() - 24 * 60 * 60 * 1000;  // 24 小時前
      const endTime = Date.now();
      return await maxV3.getHistoricalIndexPrices({ market: 'btctwd', startTime: startTime, endTime: endTime });
    }
  },
  {
    name: 'limits',
    run: async (maxV3) => {
      return await maxV3.getLimits();
    }
  },
  {
    name: 'interestRates',
    run: async (maxV3) => {
      return await maxV3.getInterestRates();
    }
  },
  {
    name: 'trades',
    run: async (maxV3) => {
      return await maxV3.getTrades('spot', { market: 'btctwd', limit: 10 });
    }
  },
  {
    name: 'accounts',
    run: async (maxV3) => {
      return await maxV3.getAccounts('spot', { market: 'btc' });
    }
  },
  {
    name: 'adRatio',
    run: async (maxV3) => {
      return await maxV3.getAdRatio();
    }
  },
  {
    name: 'loans',
    run: async (maxV3) => {
      return await maxV3.getLoans({ currency: 'usdt', limit: 10 });
    }
  },
  {
    name: 'transfers',
    run: async (maxV3) => {
      return await maxV3.getTransfers({ currency: 'usdt', side: 'in', limit: 10 });
    }
  },
  {
    name: 'repayments',
    run: async (maxV3) => {
      return await maxV3.getRepayments({ currency: 'usdt', limit: 10 });
    }
  },
  {
    name: 'liquidations',
    run: async (maxV3) => {
      const liquidations = await maxV3.getLiquidations({ limit: 10 });
      if (liquidations.length > 0) {
        const liquidationDetail = await maxV3.getLiquidationDetail(liquidations[0].sn);
        return { liquidations, liquidationDetail };
      }
      return { liquidations };
    }
  },
  {
    name: 'interests',
    run: async (maxV3) => {
      return await maxV3.getInterests({ limit: 10 });
    }
  },
  {
    name: 'timestamp',
    run: async (maxV3) => {
      return await maxV3.getTimestamp();
    }
  },
  {
    name: 'kline',
    run: async (maxV3) => {
      return await maxV3.getKLine({ market: 'btctwd', limit: 10 });
    }
  },
  {
    name: 'depth',
    run: async (maxV3) => {
      return await maxV3.getDepth({ market: 'btctwd', limit: 10 });
    }
  },
  {
    name: 'publicTrades',
    run: async (maxV3) => {
      return await maxV3.getPublicTrades({ market: 'btctwd', limit: 10 });
    }
  },
  {
    name: 'tickers',
    run: async (maxV3) => {
      return await maxV3.getTickers({ markets: ['btctwd', 'ethtwd'] });
    }
  },
  {
    name: 'ticker',
    run: async (maxV3) => {
      return await maxV3.getTicker({ market: 'btctwd' });
    }
  },
  {
    name: 'userInfo',
    run: async (maxV3) => {
      return await maxV3.getUserInfo();
    }
  },
  {
    name: 'withdrawalAddresses',
    run: async (maxV3) => {
      return await maxV3.getWithdrawAddresses({ currency: 'btc', limit: 10 });
    }
  },
  {
    name: 'withdrawals',
    run: async (maxV3) => {
      return await maxV3.getWithdrawals({ currency: 'btc', limit: 10 });
    }
  },
  {
    name: 'deposits',
    run: async (maxV3) => {
      return await maxV3.getDeposits({ limit: 10 });
    }
  },
  {
    name: 'internalTransfers',
    run: async (maxV3) => {
      return await maxV3.getInternalTransfers({ side: 'in', limit: 10 });
    }
  },
  {
    name: 'rewards',
    run: async (maxV3) => {
      return await maxV3.getRewards({ limit: 10 });
    }
  }
];

async function runExample(sectionNames) {
  const maxV3 = new Rest(process.env.MAX_ACCESSKEY, process.env.MAX_SECRET);
  const errors = [];
  const emptyResponses = [];
  async function runSection(section) {
    try {
      logSection(section.name);
      const result = await section.run(maxV3);

      if (
        (Array.isArray(result) && result.length === 0) ||
        result === undefined ||
        result === null ||
        (typeof result === 'object' && Object.keys(result).length === 0)
      ) {
        emptyResponses.push(section.name);
      }

      console.log(`${section.name} result:`, JSON.stringify(result, null, 4));
      return result;
    } catch (error) {
      console.error(`${FG_RED}Error in ${section.name}:${RESET}`, error);
      errors.push({ section: section.name, error });
    }
  }

  const sectionsToRun = sectionNames.length > 0
    ? sections.filter(section => sectionNames.includes(section.name))
    : sections;

  if (sectionsToRun.length === 0 && sectionNames.length > 0) {
    console.log(`${FG_RED}No matching sections found.${RESET}`);
    console.log('Available sections:');
    sections.forEach(section => console.log(`- ${section.name}`));
    return;
  }

  const results = [];
  for (const section of sectionsToRun) {
    const result = await runSection(section);
    results.push({ section: section.name, result });
  }

  if (errors.length > 0) {
    console.log('\n' + '='.repeat(50));
    console.log(`${BRIGHT}${FG_RED}Error Summary:${RESET}`);
    console.log('='.repeat(50));
    errors.forEach(({ section, error }) => {
      console.log(`${FG_YELLOW}${section}:${RESET} ${error.message}`);
    });
  }

  if (emptyResponses.length > 0) {
    console.log('\n' + '='.repeat(50));
    console.log(`${BRIGHT}${FG_YELLOW}Empty Response Summary:${RESET}`);
    console.log('='.repeat(50));
    emptyResponses.forEach(section => {
      console.log(`${FG_YELLOW}${section}${RESET}: Empty or undefined response`);
    });
  }

  if (errors.length === 0 && emptyResponses.length === 0) {
    console.log(`\n${FG_GREEN}${BRIGHT}All sections completed successfully with non-empty responses!${RESET}`);
  } else {
    console.log(`\n${FG_YELLOW}${BRIGHT}Execution completed with ${errors.length} errors and ${emptyResponses.length} empty responses.${RESET}`);
  }

  return results;
}

const sectionsToRun = process.argv.slice(2);

if (sectionsToRun.length === 0) {
  console.log(`${FG_YELLOW}No specific sections provided. Running all sections...${RESET}`);
  runExample([]);
} else {
  runExample(sectionsToRun);
}

if (sectionsToRun.includes('--help') || sectionsToRun.includes('-h')) {
  console.log('Usage: node script.mjs [section1] [section2] ...');
  console.log('If no sections are specified, all sections will be run.');
  console.log('\nAvailable sections:');
  sections.forEach(section => console.log(`- ${section.name}`));
  process.exit(0);
}


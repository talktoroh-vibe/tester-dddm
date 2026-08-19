import { Asset, Candle, MarketCategory, Timeframe, NewsItem, EconomicEvent, OrderBookEntry, TradeTapeItem } from '../types';

export const INITIAL_INDICES: Asset[] = [
  {
    id: 'sp500',
    symbol: 'SPX',
    name: 'S&P 500',
    category: 'US stocks',
    price: 5088.80,
    change: -8.15,
    changePercent: -0.16,
    high24h: 5110.20,
    low24h: 5074.45,
    volume: '2.84B',
    marketCap: '$44.8T',
    peRatio: '24.2',
    currency: 'USD',
    exchange: 'Cboe BZX',
    sector: 'Broad Index',
    badgeNumber: '500',
    badgeBgColor: '#F23645',
    sparkline: [5105, 5100, 5092, 5085, 5078, 5082, 5088.80],
    basePrice: 5096.95,
    isStarred: true,
  },
  {
    id: 'nasdaq100',
    symbol: 'NDX',
    name: 'Nasdaq 100',
    category: 'US stocks',
    price: 17962.31,
    change: 50.12,
    changePercent: 0.28,
    high24h: 18015.40,
    low24h: 17890.10,
    volume: '4.12B',
    marketCap: '$21.2T',
    peRatio: '31.8',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Technology & Growth',
    badgeNumber: '100',
    badgeBgColor: '#2962FF',
    sparkline: [17880, 17910, 17905, 17940, 17955, 17948, 17962.31],
    basePrice: 17912.19,
    isStarred: true,
  },
  {
    id: 'dow30',
    symbol: 'DJI',
    name: 'Dow 30',
    category: 'US stocks',
    price: 39131.53,
    change: -15.65,
    changePercent: -0.04,
    high24h: 39240.80,
    low24h: 39080.20,
    volume: '340M',
    marketCap: '$13.6T',
    peRatio: '20.4',
    currency: 'USD',
    exchange: 'DJ',
    sector: 'Industrial & Blue Chip',
    badgeNumber: '30',
    badgeBgColor: '#20A28A',
    sparkline: [39180, 39150, 39110, 39140, 39160, 39120, 39131.53],
    basePrice: 39147.18,
    isStarred: true,
  },
  {
    id: 'russell2000',
    symbol: 'RUT',
    name: 'Russell 2000',
    category: 'US stocks',
    price: 2048.65,
    change: 14.80,
    changePercent: 0.73,
    high24h: 2055.10,
    low24h: 2031.50,
    volume: '1.45B',
    marketCap: '$2.9T',
    currency: 'USD',
    exchange: 'FTSE Russell',
    sector: 'Small Cap',
    badgeNumber: '2K',
    badgeBgColor: '#089981',
    sparkline: [2032, 2038, 2041, 2039, 2045, 2048.65],
    basePrice: 2033.85,
    isStarred: false,
  },
  {
    id: 'vix',
    symbol: 'VIX',
    name: 'Volatility Index',
    category: 'Futures',
    price: 14.28,
    change: -0.42,
    changePercent: -2.85,
    high24h: 15.10,
    low24h: 14.15,
    volume: '850K',
    currency: 'USD',
    exchange: 'CBOE',
    sector: 'Volatility',
    badgeNumber: 'VX',
    badgeBgColor: '#F23645',
    sparkline: [14.85, 14.70, 14.50, 14.35, 14.28],
    basePrice: 14.70,
    isStarred: true,
  },
  {
    id: 'nikkei225',
    symbol: 'NI225',
    name: 'Nikkei 225',
    category: 'World stocks',
    price: 39098.68,
    change: 320.45,
    changePercent: 0.83,
    high24h: 39200.00,
    low24h: 38850.10,
    volume: '1.8B',
    currency: 'JPY',
    exchange: 'TSE',
    sector: 'Japan Equities',
    badgeNumber: '225',
    badgeBgColor: '#2962FF',
    sparkline: [38800, 38920, 39010, 39040, 39098.68],
    basePrice: 38778.23,
    isStarred: false,
  }
];

export const ALL_ASSETS: Asset[] = [
  ...INITIAL_INDICES,
  // US Stocks
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'US stocks',
    price: 182.52,
    change: 1.64,
    changePercent: 0.91,
    high24h: 183.40,
    low24h: 180.85,
    volume: '54.2M',
    marketCap: '$2.81T',
    peRatio: '28.4',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Consumer Electronics',
    sparkline: [180.5, 181.2, 180.9, 182.1, 182.52],
    basePrice: 180.88,
    isStarred: true,
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'US stocks',
    price: 875.28,
    change: 26.40,
    changePercent: 3.11,
    high24h: 882.00,
    low24h: 848.50,
    volume: '68.9M',
    marketCap: '$2.16T',
    peRatio: '68.5',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Semiconductors & AI',
    sparkline: [848, 856, 864, 870, 875.28],
    basePrice: 848.88,
    isStarred: true,
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'US stocks',
    price: 415.50,
    change: -1.25,
    changePercent: -0.30,
    high24h: 418.20,
    low24h: 413.90,
    volume: '22.8M',
    marketCap: '$3.08T',
    peRatio: '35.6',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Software & Cloud',
    sparkline: [417, 416.5, 414.8, 415.5],
    basePrice: 416.75,
    isStarred: true,
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    category: 'US stocks',
    price: 168.42,
    change: 2.15,
    changePercent: 1.29,
    high24h: 169.10,
    low24h: 166.30,
    volume: '28.1M',
    marketCap: '$2.09T',
    peRatio: '25.1',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Internet & Search',
    sparkline: [166.2, 167.0, 167.8, 168.42],
    basePrice: 166.27,
    isStarred: false,
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    category: 'US stocks',
    price: 178.15,
    change: 0.85,
    changePercent: 0.48,
    high24h: 179.30,
    low24h: 176.90,
    volume: '36.4M',
    marketCap: '$1.85T',
    peRatio: '52.3',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'E-Commerce & Cloud',
    sparkline: [177.0, 177.5, 178.0, 178.15],
    basePrice: 177.30,
    isStarred: false,
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'US stocks',
    price: 198.80,
    change: -5.40,
    changePercent: -2.64,
    high24h: 206.50,
    low24h: 197.20,
    volume: '92.4M',
    marketCap: '$632B',
    peRatio: '46.1',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Automotive & Clean Energy',
    sparkline: [205, 203, 200, 198.80],
    basePrice: 204.20,
    isStarred: true,
  },
  // World stocks
  {
    id: 'tsm',
    symbol: 'TSM',
    name: 'Taiwan Semiconductor',
    category: 'World stocks',
    price: 142.90,
    change: 3.80,
    changePercent: 2.73,
    high24h: 143.50,
    low24h: 139.80,
    volume: '15.6M',
    marketCap: '$740B',
    peRatio: '26.8',
    currency: 'USD',
    exchange: 'NYSE',
    sector: 'Foundry & Chips',
    sparkline: [139.5, 140.8, 141.9, 142.90],
    basePrice: 139.10,
    isStarred: true,
  },
  {
    id: 'asml',
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    category: 'World stocks',
    price: 945.60,
    change: 18.20,
    changePercent: 1.96,
    high24h: 950.00,
    low24h: 932.10,
    volume: '2.1M',
    marketCap: '$380B',
    currency: 'EUR',
    exchange: 'Euronext Amsterdam',
    sector: 'Semiconductor Equipment',
    sparkline: [930, 936, 942, 945.6],
    basePrice: 927.40,
    isStarred: false,
  },
  // Crypto
  {
    id: 'btc',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'Crypto',
    price: 66840.50,
    change: 1845.20,
    changePercent: 2.84,
    high24h: 67450.00,
    low24h: 64920.00,
    volume: '$32.4B',
    marketCap: '$1.31T',
    currency: 'USD',
    exchange: 'Crypto Composite',
    sector: 'Layer 1 Digital Store of Value',
    sparkline: [64800, 65300, 66100, 66840.50],
    basePrice: 64995.30,
    isStarred: true,
  },
  {
    id: 'eth',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'Crypto',
    price: 3512.40,
    change: 98.70,
    changePercent: 2.89,
    high24h: 3560.00,
    low24h: 3410.20,
    volume: '$16.8B',
    marketCap: '$422B',
    currency: 'USD',
    exchange: 'Crypto Composite',
    sector: 'Smart Contracts Platform',
    sparkline: [3410, 3450, 3490, 3512.4],
    basePrice: 3413.70,
    isStarred: true,
  },
  {
    id: 'sol',
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'Crypto',
    price: 174.60,
    change: 9.30,
    changePercent: 5.63,
    high24h: 178.00,
    low24h: 164.50,
    volume: '$5.2B',
    marketCap: '$78.4B',
    currency: 'USD',
    exchange: 'Crypto Composite',
    sector: 'High Performance L1',
    sparkline: [164, 168, 172, 174.60],
    basePrice: 165.30,
    isStarred: true,
  },
  // Futures & Commodities
  {
    id: 'gold',
    symbol: 'GC1!',
    name: 'Gold Futures',
    category: 'Futures',
    price: 2368.50,
    change: 14.80,
    changePercent: 0.63,
    high24h: 2374.00,
    low24h: 2351.20,
    volume: '240K',
    currency: 'USD',
    exchange: 'COMEX',
    sector: 'Precious Metals',
    sparkline: [2352, 2358, 2364, 2368.5],
    basePrice: 2353.70,
    isStarred: true,
  },
  {
    id: 'oil',
    symbol: 'CL1!',
    name: 'Crude Oil WTI',
    category: 'Futures',
    price: 82.45,
    change: -1.35,
    changePercent: -1.61,
    high24h: 84.10,
    low24h: 81.90,
    volume: '380K',
    currency: 'USD',
    exchange: 'NYMEX',
    sector: 'Energy',
    sparkline: [83.8, 83.2, 82.8, 82.45],
    basePrice: 83.80,
    isStarred: false,
  },
  // Forex
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'Forex',
    price: 1.0842,
    change: -0.0018,
    changePercent: -0.17,
    high24h: 1.0875,
    low24h: 1.0830,
    volume: '$480B',
    currency: 'USD',
    exchange: 'FXCM',
    sector: 'Major Currency Pair',
    sparkline: [1.086, 1.0855, 1.0848, 1.0842],
    basePrice: 1.0860,
    isStarred: true,
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'Forex',
    price: 156.78,
    change: 0.62,
    changePercent: 0.40,
    high24h: 157.10,
    low24h: 155.90,
    volume: '$390B',
    currency: 'JPY',
    exchange: 'FXCM',
    sector: 'Major Currency Pair',
    sparkline: [156.1, 156.3, 156.6, 156.78],
    basePrice: 156.16,
    isStarred: true,
  },
  // Government bonds
  {
    id: 'us10y',
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    category: 'Government bonds',
    price: 4.482,
    change: -0.035,
    changePercent: -0.77,
    high24h: 4.525,
    low24h: 4.470,
    volume: '$750B',
    yield: '4.482%',
    currency: '%',
    exchange: 'Treasury Benchmark',
    sector: 'Sovereign Debt',
    sparkline: [4.52, 4.50, 4.49, 4.482],
    basePrice: 4.517,
    isStarred: true,
  },
  // ETFs
  {
    id: 'spy',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    category: 'ETFs',
    price: 508.45,
    change: -0.80,
    changePercent: -0.16,
    high24h: 510.60,
    low24h: 507.20,
    volume: '64.5M',
    marketCap: '$512B',
    currency: 'USD',
    exchange: 'NYSE Arca',
    sector: 'Broad Market Equity',
    sparkline: [509.5, 509.0, 508.1, 508.45],
    basePrice: 509.25,
    isStarred: false,
  },
  {
    id: 'qqq',
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    category: 'ETFs',
    price: 442.30,
    change: 1.25,
    changePercent: 0.28,
    high24h: 444.10,
    low24h: 440.50,
    volume: '42.8M',
    marketCap: '$248B',
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Large Cap Tech',
    sparkline: [440.8, 441.5, 441.9, 442.30],
    basePrice: 441.05,
    isStarred: true,
  }
];

export const REGIONS = [
  { id: 'all', name: 'Markets, everywhere', description: 'Global unified feed across all asset classes & indices', count: '100+ Exchanges' },
  { id: 'us', name: 'United States', description: 'NYSE, NASDAQ, CME, CBOE indices and blue-chip equities', count: '10,000+ Tickers' },
  { id: 'europe', name: 'Europe', description: 'London, Frankfurt, Paris, Amsterdam, Zurich exchanges', count: '35+ Countries' },
  { id: 'asia', name: 'Asia-Pacific', description: 'Tokyo, Hong Kong, Shanghai, Singapore, Sydney', count: '28+ Exchanges' },
  { id: 'crypto', name: 'Crypto & Digital Assets', description: '24/7 decentralized networks, layer-1s, and DeFi tokens', count: '1,200+ Pairs' },
  { id: 'macro', name: 'Macro & Central Banks', description: 'Treasury yields, inflation gauges, and benchmark rates', count: 'Global Coverage' },
];

export const BREAKING_NEWS: NewsItem[] = [
  {
    id: 'n1',
    source: 'Bloomberg Wire',
    headline: 'Federal Reserve Holds Interest Rates Steady, Highlights Progress on PCE Inflation Disinflation',
    timeAgo: '4m ago',
    sentiment: 'BULLISH',
    relatedSymbols: ['SPX', 'NDX', 'US10Y'],
  },
  {
    id: 'n2',
    source: 'Reuters Markets',
    headline: 'Nvidia Unveils Next-Gen AI Silicon Architecture With 4x Inference Throughput Surge',
    timeAgo: '18m ago',
    sentiment: 'BULLISH',
    relatedSymbols: ['NVDA', 'TSM', 'MSFT'],
  },
  {
    id: 'n3',
    source: 'TradingView News',
    headline: 'Bitcoin Breaches Key $66.8K Resistance Band as Institutional ETF Inflows Accelerate',
    timeAgo: '32m ago',
    sentiment: 'BULLISH',
    relatedSymbols: ['BTC/USD', 'ETH/USD'],
  },
  {
    id: 'n4',
    source: 'Financial Times',
    headline: 'European Central Bank Signals Impending Rate Cuts Amid Subdued Eurozone Manufacturing',
    timeAgo: '1h ago',
    sentiment: 'NEUTRAL',
    relatedSymbols: ['EUR/USD', 'DAX'],
  },
  {
    id: 'n5',
    source: 'WSJ Live',
    headline: 'Crude Oil Settles Lower After US Commercial Inventories Expand Above Forecast',
    timeAgo: '2h ago',
    sentiment: 'BEARISH',
    relatedSymbols: ['CL1!', 'GC1!'],
  },
];

export const UPCOMING_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'e1',
    time: '14:30 EST',
    country: 'United States',
    flag: '🇺🇸',
    title: 'Core PCE Price Index (MoM)',
    impact: 'HIGH',
    forecast: '0.2%',
    previous: '0.3%',
  },
  {
    id: 'e2',
    time: '15:00 EST',
    country: 'United States',
    flag: '🇺🇸',
    title: 'FOMC Press Conference',
    impact: 'HIGH',
    forecast: '5.25%',
    previous: '5.25%',
  },
  {
    id: 'e3',
    time: 'Tomorrow 08:30',
    country: 'Eurozone',
    flag: '🇪🇺',
    title: 'ECB Monetary Policy Statement',
    impact: 'HIGH',
    forecast: '3.75%',
    previous: '4.00%',
  },
  {
    id: 'e4',
    time: 'Friday 08:30',
    country: 'United States',
    flag: '🇺🇸',
    title: 'Non-Farm Payrolls (NFP)',
    impact: 'HIGH',
    forecast: '185K',
    previous: '175K',
  },
  {
    id: 'e5',
    time: 'Friday 10:00',
    country: 'United States',
    flag: '🇺🇸',
    title: 'Michigan Consumer Sentiment',
    impact: 'MEDIUM',
    forecast: '69.1',
    previous: '67.4',
  },
];

// Realistic Candlestick Historical Data Generator
export function generateCandles(asset: Asset, timeframe: Timeframe): Candle[] {
  let count = 48;
  let volatility = 0.008;
  let intervalMinutes = 5;

  switch (timeframe) {
    case '1D':
      count = 55;
      volatility = 0.0035;
      intervalMinutes = 10;
      break;
    case '5D':
      count = 65;
      volatility = 0.007;
      intervalMinutes = 60;
      break;
    case '1M':
      count = 50;
      volatility = 0.012;
      intervalMinutes = 24 * 60;
      break;
    case '3M':
      count = 70;
      volatility = 0.018;
      intervalMinutes = 24 * 60;
      break;
    case '6M':
      count = 85;
      volatility = 0.022;
      intervalMinutes = 48 * 60;
      break;
    case '1Y':
      count = 105;
      volatility = 0.028;
      intervalMinutes = 72 * 60;
      break;
    case '5Y':
    case 'ALL':
      count = 130;
      volatility = 0.035;
      intervalMinutes = 120 * 60;
      break;
  }

  const candles: Candle[] = [];
  const now = Date.now();
  let currentPrice = asset.price * (1 - (asset.changePercent / 100) * 0.75);

  let seed = 0;
  for (let i = 0; i < asset.symbol.length; i++) {
    seed += asset.symbol.charCodeAt(i);
  }

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMinutes * 60 * 1000;
    const date = new Date(timestamp);
    
    let timeStr = '';
    if (timeframe === '1D') {
      timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '5D' || timeframe === '1M') {
      timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
    } else {
      timeStr = `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    }

    const pseudoRandom = Math.sin(seed + i * 1.37) * 0.5 + Math.cos(i * 0.73) * 0.5;
    const delta = currentPrice * volatility * pseudoRandom;
    
    const open = currentPrice;
    let close = open + delta;
    
    if (i === 0) {
      close = asset.price;
    }

    const high = Math.max(open, close) + Math.abs(currentPrice * volatility * (Math.abs(pseudoRandom) * 0.8 + 0.2));
    const low = Math.min(open, close) - Math.abs(currentPrice * volatility * (Math.abs(pseudoRandom) * 0.8 + 0.2));
    const volume = Math.floor(Math.abs(pseudoRandom * 80000) + 12000);

    candles.push({
      time: timeStr,
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return candles;
}

// Generate Realistic Order Book Depth Ladder for an Asset
export function generateOrderBook(price: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[]; spread: number } {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  const step = price * 0.0004;

  let cumBidTotal = 0;
  for (let i = 1; i <= 6; i++) {
    const bidPrice = Number((price - i * step).toFixed(2));
    const amount = Math.floor(Math.random() * 450 + 50);
    cumBidTotal += amount;
    bids.push({
      price: bidPrice,
      amount,
      total: cumBidTotal,
      depthPercent: Math.min(100, (cumBidTotal / 2500) * 100),
    });
  }

  let cumAskTotal = 0;
  for (let i = 1; i <= 6; i++) {
    const askPrice = Number((price + i * step).toFixed(2));
    const amount = Math.floor(Math.random() * 450 + 50);
    cumAskTotal += amount;
    asks.push({
      price: askPrice,
      amount,
      total: cumAskTotal,
      depthPercent: Math.min(100, (cumAskTotal / 2500) * 100),
    });
  }

  const spread = Number((asks[0].price - bids[0].price).toFixed(2));
  return { bids, asks, spread };
}

// Generate Live Time & Sales Tape
export function generateRecentTrades(price: number): TradeTapeItem[] {
  const trades: TradeTapeItem[] = [];
  const now = Date.now();

  for (let i = 0; i < 8; i++) {
    const isBuy = Math.random() > 0.45;
    const delta = (Math.random() - 0.5) * price * 0.0006;
    const tradePrice = Number((price + delta).toFixed(2));
    const date = new Date(now - i * 1400);

    trades.push({
      id: `trade_${i}_${now}`,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: tradePrice,
      amount: Math.floor(Math.random() * 200 + 10),
      side: isBuy ? 'BUY' : 'SELL',
    });
  }
  return trades;
}

// Compute Technical Summary Rating
export function computeTechnicalRating(asset: Asset): {
  rating: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  score: number; // 0 to 100
  buyCount: number;
  neutralCount: number;
  sellCount: number;
  rsi: number;
  macd: string;
} {
  const change = asset.changePercent;
  let buyCount = 14;
  let neutralCount = 7;
  let sellCount = 5;
  let score = 65;
  let rating: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL' = 'BUY';
  let rsi = 56.4;
  let macd = 'Bullish Crossover';

  if (change > 2) {
    buyCount = 19;
    neutralCount = 4;
    sellCount = 3;
    score = 85;
    rating = 'STRONG BUY';
    rsi = 68.2;
    macd = 'Strong Bullish Expansion';
  } else if (change > 0.2) {
    buyCount = 15;
    neutralCount = 7;
    sellCount = 4;
    score = 68;
    rating = 'BUY';
    rsi = 57.5;
    macd = 'Bullish Trend';
  } else if (change > -0.5) {
    buyCount = 9;
    neutralCount = 10;
    sellCount = 7;
    score = 50;
    rating = 'NEUTRAL';
    rsi = 49.1;
    macd = 'Neutral Convergence';
  } else if (change > -2) {
    buyCount = 5;
    neutralCount = 6;
    sellCount = 15;
    score = 32;
    rating = 'SELL';
    rsi = 39.8;
    macd = 'Bearish Momentum';
  } else {
    buyCount = 2;
    neutralCount = 4;
    sellCount = 20;
    score = 15;
    rating = 'STRONG SELL';
    rsi = 28.4;
    macd = 'Strong Bearish Breakdown';
  }

  return { rating, score, buyCount, neutralCount, sellCount, rsi, macd };
}

import { Asset, Candle, MarketCategory, Timeframe } from '../types';

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
  },
  {
    id: 'nvo',
    symbol: 'NVO',
    name: 'Novo Nordisk A/S',
    category: 'World stocks',
    price: 134.75,
    change: -1.10,
    changePercent: -0.81,
    high24h: 136.20,
    low24h: 134.10,
    volume: '8.4M',
    marketCap: '$590B',
    currency: 'USD',
    exchange: 'NYSE',
    sector: 'Healthcare & Pharma',
    sparkline: [136, 135.5, 134.9, 134.75],
    basePrice: 135.85,
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
  },
  {
    id: 'silver',
    symbol: 'SI1!',
    name: 'Silver Futures',
    category: 'Futures',
    price: 30.68,
    change: 0.45,
    changePercent: 1.49,
    high24h: 30.95,
    low24h: 30.15,
    volume: '110K',
    currency: 'USD',
    exchange: 'COMEX',
    sector: 'Precious Metals',
    sparkline: [30.1, 30.3, 30.5, 30.68],
    basePrice: 30.23,
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
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'Forex',
    price: 1.2715,
    change: 0.0032,
    changePercent: 0.25,
    high24h: 1.2740,
    low24h: 1.2675,
    volume: '$260B',
    currency: 'USD',
    exchange: 'FXCM',
    sector: 'Major Currency Pair',
    sparkline: [1.268, 1.270, 1.271, 1.2715],
    basePrice: 1.2683,
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
  },
  {
    id: 'us02y',
    symbol: 'US02Y',
    name: 'US 2-Year Treasury Yield',
    category: 'Government bonds',
    price: 4.825,
    change: -0.021,
    changePercent: -0.43,
    high24h: 4.855,
    low24h: 4.815,
    volume: '$920B',
    yield: '4.825%',
    currency: '%',
    exchange: 'Treasury Benchmark',
    sector: 'Sovereign Debt',
    sparkline: [4.84, 4.835, 4.83, 4.825],
    basePrice: 4.846,
  },
  // Corporate bonds
  {
    id: 'lqd',
    symbol: 'LQD',
    name: 'iShares $ Investment Grade Bond ETF',
    category: 'Corporate bonds',
    price: 108.64,
    change: 0.38,
    changePercent: 0.35,
    high24h: 108.85,
    low24h: 108.20,
    volume: '18.4M',
    marketCap: '$34.2B',
    yield: '5.22%',
    currency: 'USD',
    exchange: 'NYSE Arca',
    sector: 'Corporate Fixed Income',
    sparkline: [108.2, 108.4, 108.55, 108.64],
    basePrice: 108.26,
  },
  {
    id: 'hyg',
    symbol: 'HYG',
    name: 'iShares High Yield Corporate Bond ETF',
    category: 'Corporate bonds',
    price: 77.82,
    change: 0.22,
    changePercent: 0.28,
    high24h: 77.95,
    low24h: 77.55,
    volume: '32.1M',
    marketCap: '$17.8B',
    yield: '7.45%',
    currency: 'USD',
    exchange: 'NYSE Arca',
    sector: 'High Yield Debt',
    sparkline: [77.5, 77.65, 77.75, 77.82],
    basePrice: 77.60,
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
  },
  // Economy Indicators
  {
    id: 'cpi',
    symbol: 'US-CPI',
    name: 'US Consumer Price Index (YoY)',
    category: 'Economy',
    price: 3.4,
    change: -0.1,
    changePercent: -2.86,
    high24h: 3.5,
    low24h: 3.4,
    volume: 'Macro',
    currency: '%',
    exchange: 'Bureau of Labor Statistics',
    sector: 'Macroeconomic Metric',
    sparkline: [3.7, 3.6, 3.5, 3.4],
    basePrice: 3.5,
  },
  {
    id: 'fedfunds',
    symbol: 'FEDFUNDS',
    name: 'Federal Funds Target Rate',
    category: 'Economy',
    price: 5.33,
    change: 0.0,
    changePercent: 0.0,
    high24h: 5.33,
    low24h: 5.33,
    volume: 'Policy',
    currency: '%',
    exchange: 'Federal Reserve',
    sector: 'Monetary Policy',
    sparkline: [5.33, 5.33, 5.33, 5.33],
    basePrice: 5.33,
  }
];

export const REGIONS: { id: string; name: string; description: string; count: string }[] = [
  { id: 'all', name: 'Markets, everywhere', description: 'Global unified feed across all asset classes & indices', count: '100+ Exchanges' },
  { id: 'us', name: 'United States', description: 'NYSE, NASDAQ, CME, CBOE indices and blue-chip equities', count: '10,000+ Tickers' },
  { id: 'europe', name: 'Europe', description: 'London, Frankfurt, Paris, Amsterdam, Zurich exchanges', count: '35+ Countries' },
  { id: 'asia', name: 'Asia-Pacific', description: 'Tokyo, Hong Kong, Shanghai, Singapore, Sydney', count: '28+ Exchanges' },
  { id: 'crypto', name: 'Crypto & Digital Assets', description: '24/7 decentralized networks, layer-1s, and DeFi tokens', count: '1,200+ Pairs' },
  { id: 'macro', name: 'Macro & Central Banks', description: 'Treasury yields, inflation gauges, and benchmark rates', count: 'Global Coverage' },
];

// Realistic Candlestick Historical Data Generator
export function generateCandles(asset: Asset, timeframe: Timeframe): Candle[] {
  let count = 48;
  let volatility = 0.008;
  let intervalMinutes = 5;

  switch (timeframe) {
    case '1D':
      count = 50;
      volatility = 0.003;
      intervalMinutes = 10;
      break;
    case '5D':
      count = 60;
      volatility = 0.006;
      intervalMinutes = 60;
      break;
    case '1M':
      count = 45;
      volatility = 0.012;
      intervalMinutes = 24 * 60;
      break;
    case '3M':
      count = 65;
      volatility = 0.018;
      intervalMinutes = 24 * 60;
      break;
    case '6M':
      count = 80;
      volatility = 0.022;
      intervalMinutes = 48 * 60;
      break;
    case '1Y':
      count = 100;
      volatility = 0.028;
      intervalMinutes = 72 * 60;
      break;
    case '5Y':
    case 'ALL':
      count = 120;
      volatility = 0.035;
      intervalMinutes = 120 * 60;
      break;
  }

  const candles: Candle[] = [];
  const now = Date.now();
  let currentPrice = asset.price * (1 - (asset.changePercent / 100) * 0.7);

  // Seed deterministic variation using asset symbol
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
    
    // Ensure final candle matches current live price
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

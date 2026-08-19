export type MarketCategory = 
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

export type ChartType = 'candles' | 'area' | 'line' | 'baseline';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  peRatio?: string;
  yield?: string;
  currency: string;
  exchange: string;
  sector?: string;
  badgeNumber?: string;
  badgeBgColor?: string;
  sparkline: number[];
  basePrice: number;
}

export interface MarketRegion {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  price: number;
  amount: number;
  total: number;
  timestamp: Date;
  status: 'FILLED' | 'PENDING';
}

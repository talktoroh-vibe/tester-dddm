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

export type ChartType = 'candles' | 'hollow' | 'heikin' | 'area' | 'line' | 'baseline';

export type DrawingTool = 
  | 'cursor' 
  | 'trendline' 
  | 'horizontal' 
  | 'fibonacci' 
  | 'position_long' 
  | 'position_short' 
  | 'measure';

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
  isStarred?: boolean;
}

export interface Position {
  id: string;
  symbol: string;
  assetName: string;
  side: 'BUY' | 'SELL';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  takeProfit?: number;
  stopLoss?: number;
  timestamp: Date;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  price: number;
  amount: number;
  total: number;
  timestamp: Date;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depthPercent: number;
}

export interface TradeTapeItem {
  id: string;
  time: string;
  price: number;
  amount: number;
  side: 'BUY' | 'SELL';
}

export interface NewsItem {
  id: string;
  source: string;
  headline: string;
  timeAgo: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relatedSymbols: string[];
  url?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdPrice: number;
  createdAt: Date;
  isTriggered: boolean;
}

export interface TechnicalIndicatorConfig {
  ma20: boolean;
  ma50: boolean;
  ema20: boolean;
  bollinger: boolean;
  volume: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
}

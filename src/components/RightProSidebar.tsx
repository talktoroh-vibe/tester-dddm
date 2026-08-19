import React, { useState } from 'react';
import { Asset, NewsItem, EconomicEvent, PriceAlert, OrderBookEntry, TradeTapeItem } from '../types';
import { 
  Star, List, BarChart3, Radio, Newspaper, Calendar, Bell, 
  ChevronRight, ChevronLeft, Plus, Trash2, ArrowUpRight, 
  ArrowDownRight, Check, Zap, Volume2, ShieldAlert
} from 'lucide-react';
import { BREAKING_NEWS, UPCOMING_ECONOMIC_EVENTS, generateOrderBook, generateRecentTrades, computeTechnicalRating } from '../data/marketData';
import { playAlertSound, playOrderSound } from '../utils/audio';

interface RightProSidebarProps {
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  onToggleStar: (assetId: string) => void;
  onExecuteQuickOrder: (side: 'BUY' | 'SELL', price: number, amount: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isTriggered'>) => void;
  onRemoveAlert: (id: string) => void;
}

export const RightProSidebar: React.FC<RightProSidebarProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onToggleStar,
  onExecuteQuickOrder,
  isOpen,
  onToggleOpen,
  alerts,
  onAddAlert,
  onRemoveAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'dom' | 'tech' | 'news' | 'calendar' | 'alerts'>('watchlist');
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'starred' | 'crypto' | 'stocks'>('all');
  const [orderAmount, setOrderAmount] = useState(10);
  const [newAlertPrice, setNewAlertPrice] = useState(selectedAsset.price);

  // Generate dynamic data for active asset
  const orderBook = generateOrderBook(selectedAsset.price);
  const recentTrades = generateRecentTrades(selectedAsset.price);
  const techRating = computeTechnicalRating(selectedAsset);

  // Filter watchlist
  const filteredWatchlist = assets.filter((a) => {
    if (watchlistFilter === 'starred') return a.isStarred;
    if (watchlistFilter === 'crypto') return a.category === 'Crypto';
    if (watchlistFilter === 'stocks') return a.category.includes('stocks');
    return true;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      symbol: selectedAsset.symbol,
      targetPrice: Number(newAlertPrice),
      condition: Number(newAlertPrice) >= selectedAsset.price ? 'ABOVE' : 'BELOW',
      createdPrice: selectedAsset.price,
    });
    playAlertSound();
  };

  return (
    <aside
      className={`bg-[#171B26] border-l border-[#363A45] flex transition-all duration-300 z-30 flex-shrink-0 ${
        isOpen ? 'w-80 sm:w-96' : 'w-12'
      }`}
    >
      {/* Icon Navigation Column */}
      <div className="w-12 bg-[#131722] border-r border-[#363A45] flex flex-col items-center py-3 gap-3 flex-shrink-0">
        <button
          onClick={onToggleOpen}
          className="p-2 text-[#8d90a2] hover:text-white rounded-lg hover:bg-[#1E222D] transition-colors"
          title={isOpen ? 'Collapse Panel' : 'Expand Pro Panel'}
        >
          {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className="w-6 h-px bg-[#363A45]" />

        <button
          onClick={() => {
            setActiveTab('watchlist');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'watchlist' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Watchlist & Quotes"
        >
          <List className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('dom');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'dom' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Depth of Market (DOM) Level 2"
        >
          <BarChart3 className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('tech');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'tech' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Technical Analysis Rating"
        >
          <Radio className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('news');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'news' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Breaking News & Wire"
        >
          <Newspaper className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('calendar');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'calendar' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Economic Calendar"
        >
          <Calendar className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setActiveTab('alerts');
            if (!isOpen) onToggleOpen();
          }}
          className={`p-2 rounded-lg transition-colors relative ${
            activeTab === 'alerts' && isOpen ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
          }`}
          title="Price Alerts"
        >
          <Bell className="w-5 h-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2962FF] text-white font-mono text-[9px] flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Content Area */}
      {isOpen && (
        <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#171B26]">
          {/* TAB 1: WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#363A45] flex items-center justify-between bg-[#1E222D]">
                <div>
                  <div className="font-headline font-bold text-sm text-white">Watchlist</div>
                  <div className="text-[11px] text-[#8d90a2]">Institutional Tracked Quotes</div>
                </div>

                <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#363A45]">
                  <button
                    onClick={() => setWatchlistFilter('all')}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      watchlistFilter === 'all' ? 'bg-[#2962FF] text-white font-medium' : 'text-[#8d90a2]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setWatchlistFilter('starred')}
                    className={`px-2 py-0.5 text-[11px] rounded flex items-center gap-0.5 ${
                      watchlistFilter === 'starred' ? 'bg-[#2962FF] text-white font-medium' : 'text-[#8d90a2]'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                  <button
                    onClick={() => setWatchlistFilter('stocks')}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      watchlistFilter === 'stocks' ? 'bg-[#2962FF] text-white font-medium' : 'text-[#8d90a2]'
                    }`}
                  >
                    Stocks
                  </button>
                </div>
              </div>

              {/* Watchlist Table */}
              <div className="flex-grow overflow-y-auto divide-y divide-[#363A45]/40">
                {filteredWatchlist.map((asset) => {
                  const isSelected = selectedAsset.id === asset.id;
                  const isPositive = asset.changePercent >= 0;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className={`flex items-center justify-between px-3.5 py-2.5 hover:bg-[#262A35] transition-colors cursor-pointer group select-none ${
                        isSelected ? 'bg-[#2962FF]/15 border-l-2 border-[#2962FF]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(asset.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            asset.isStarred
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-[#8d90a2] opacity-0 group-hover:opacity-100 hover:text-white'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>

                        <div className="truncate">
                          <div className="font-semibold text-xs text-white group-hover:text-[#2962FF] transition-colors">
                            {asset.symbol}
                          </div>
                          <div className="text-[10px] text-[#8d90a2] truncate max-w-[110px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono flex-shrink-0">
                        <div className="text-xs font-semibold text-[#dfe2f2]">
                          {asset.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: asset.price < 2 ? 4 : 2,
                          })}
                        </div>
                        <div
                          className={`text-[10px] font-semibold ${
                            isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {asset.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DEPTH OF MARKET (DOM) LEVEL 2 */}
          {activeTab === 'dom' && (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#363A45] bg-[#1E222D] flex items-center justify-between">
                <div>
                  <div className="font-headline font-bold text-sm text-white">Depth of Market (DOM)</div>
                  <div className="text-[11px] text-[#8d90a2] font-mono">
                    {selectedAsset.symbol} • Spread: ${orderBook.spread}
                  </div>
                </div>
                <span className="text-[10px] bg-[#089981]/20 text-[#089981] px-2 py-0.5 rounded font-mono font-semibold">
                  L2 LIVE
                </span>
              </div>

              {/* Asks (Sells in Red) */}
              <div className="p-3 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#8d90a2] uppercase mb-1">
                  <span>Price (USD)</span>
                  <span>Size</span>
                  <span>Total</span>
                </div>

                {orderBook.asks.slice().reverse().map((ask, i) => (
                  <div
                    key={`ask_${i}`}
                    onClick={() => {
                      onExecuteQuickOrder('BUY', ask.price, orderAmount);
                      playOrderSound(true);
                    }}
                    className="relative flex justify-between items-center text-[11px] font-mono py-1 px-2 rounded hover:bg-[#F23645]/20 cursor-pointer group transition-colors"
                  >
                    {/* Depth bar */}
                    <div
                      style={{ width: `${ask.depthPercent}%` }}
                      className="absolute right-0 top-0 bottom-0 bg-[#F23645]/15 rounded-r pointer-events-none"
                    />
                    <span className="text-[#F23645] font-semibold relative z-10">{ask.price.toFixed(2)}</span>
                    <span className="text-[#8d90a2] relative z-10">{ask.amount}</span>
                    <span className="text-[#dfe2f2] relative z-10">{ask.total}</span>
                  </div>
                ))}

                {/* Current Mid Price */}
                <div className="py-2 my-1 border-y border-[#363A45] flex items-center justify-between font-mono px-2 bg-[#131722] rounded">
                  <span className="text-xs font-bold text-white">${selectedAsset.price.toFixed(2)}</span>
                  <span className="text-[10px] text-[#8d90a2]">Mid Market</span>
                </div>

                {/* Bids (Buys in Green) */}
                {orderBook.bids.map((bid, i) => (
                  <div
                    key={`bid_${i}`}
                    onClick={() => {
                      onExecuteQuickOrder('SELL', bid.price, orderAmount);
                      playOrderSound(true);
                    }}
                    className="relative flex justify-between items-center text-[11px] font-mono py-1 px-2 rounded hover:bg-[#089981]/20 cursor-pointer group transition-colors"
                  >
                    {/* Depth bar */}
                    <div
                      style={{ width: `${bid.depthPercent}%` }}
                      className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 rounded-r pointer-events-none"
                    />
                    <span className="text-[#089981] font-semibold relative z-10">{bid.price.toFixed(2)}</span>
                    <span className="text-[#8d90a2] relative z-10">{bid.amount}</span>
                    <span className="text-[#dfe2f2] relative z-10">{bid.total}</span>
                  </div>
                ))}
              </div>

              {/* 1-Click Quick Execution Bar */}
              <div className="p-3 bg-[#1E222D] border-t border-[#363A45] space-y-2 mt-auto">
                <div className="flex items-center justify-between text-xs text-[#8d90a2]">
                  <span>Order Size:</span>
                  <div className="flex items-center gap-1 font-mono">
                    {[5, 10, 25, 50].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setOrderAmount(sz)}
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          orderAmount === sz ? 'bg-[#2962FF] text-white' : 'bg-[#131722] text-[#8d90a2]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onExecuteQuickOrder('BUY', selectedAsset.price, orderAmount);
                      playOrderSound(true);
                    }}
                    className="bg-[#089981] hover:bg-[#07856f] text-white font-bold py-2 rounded-lg text-xs shadow cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>BUY MKT ({orderAmount})</span>
                  </button>
                  <button
                    onClick={() => {
                      onExecuteQuickOrder('SELL', selectedAsset.price, orderAmount);
                      playOrderSound(true);
                    }}
                    className="bg-[#F23645] hover:bg-[#d82a38] text-white font-bold py-2 rounded-lg text-xs shadow cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>SELL MKT ({orderAmount})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL ANALYSIS RATING */}
          {activeTab === 'tech' && (
            <div className="p-4 space-y-5 overflow-y-auto">
              <div className="border-b border-[#363A45] pb-3">
                <div className="font-headline font-bold text-base text-white">{selectedAsset.symbol} Technicals</div>
                <div className="text-xs text-[#8d90a2]">Summary of 26 Moving Averages & Oscillators</div>
              </div>

              {/* Big Summary Badge */}
              <div className="bg-[#1E222D] border border-[#363A45] rounded-2xl p-4 text-center space-y-3">
                <div className="text-xs uppercase font-bold text-[#8d90a2]">Technical Gauge</div>
                <div
                  className={`text-xl font-headline font-extrabold tracking-wide ${
                    techRating.rating.includes('BUY')
                      ? 'text-[#089981]'
                      : techRating.rating.includes('SELL')
                      ? 'text-[#F23645]'
                      : 'text-amber-400'
                  }`}
                >
                  {techRating.rating}
                </div>

                {/* Score Bar Gauge */}
                <div className="w-full h-3 bg-[#131722] rounded-full overflow-hidden flex border border-[#363A45]">
                  <div style={{ width: '30%' }} className="bg-[#F23645]/80" title="Sell Zone" />
                  <div style={{ width: '40%' }} className="bg-amber-400/80" title="Neutral Zone" />
                  <div style={{ width: '30%' }} className="bg-[#089981]/80" title="Buy Zone" />
                </div>

                {/* Indicator Vote Count Pills */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                  <div className="bg-[#F23645]/15 border border-[#F23645]/30 p-2 rounded-lg">
                    <div className="text-[#F23645] font-bold text-sm">{techRating.sellCount}</div>
                    <div className="text-[10px] text-[#8d90a2]">Sell</div>
                  </div>
                  <div className="bg-amber-400/15 border border-amber-400/30 p-2 rounded-lg">
                    <div className="text-amber-400 font-bold text-sm">{techRating.neutralCount}</div>
                    <div className="text-[10px] text-[#8d90a2]">Neutral</div>
                  </div>
                  <div className="bg-[#089981]/15 border border-[#089981]/30 p-2 rounded-lg">
                    <div className="text-[#089981] font-bold text-sm">{techRating.buyCount}</div>
                    <div className="text-[10px] text-[#8d90a2]">Buy</div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-white text-xs uppercase tracking-wider">Key Indicators</div>
                <div className="bg-[#1E222D] rounded-xl p-3 border border-[#363A45] space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8d90a2]">Relative Strength (RSI 14):</span>
                    <span className="text-white font-bold">{techRating.rsi} (Neutral)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8d90a2]">MACD Level (12, 26):</span>
                    <span className="text-[#089981] font-bold">{techRating.macd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8d90a2]">Bollinger Bands (20, 2):</span>
                    <span className="text-white">Upper Band Test</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8d90a2]">EMA 200 Trend:</span>
                    <span className="text-[#089981] font-bold">Bullish Above</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BREAKING NEWS */}
          {activeTab === 'news' && (
            <div className="p-3 space-y-3 overflow-y-auto">
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="font-headline font-bold text-sm text-white">Breaking Market Wire</span>
                <span className="w-2 h-2 rounded-full bg-[#F23645] animate-ping" />
              </div>

              {BREAKING_NEWS.map((news) => (
                <div
                  key={news.id}
                  className="bg-[#1E222D] border border-[#363A45] rounded-xl p-3 space-y-2 hover:border-[#2962FF] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#2962FF]">{news.source}</span>
                    <span className="text-[#8d90a2]">{news.timeAgo}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#dfe2f2] group-hover:text-white leading-snug">
                    {news.headline}
                  </h4>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        news.sentiment === 'BULLISH'
                          ? 'bg-[#089981]/20 text-[#089981]'
                          : news.sentiment === 'BEARISH'
                          ? 'bg-[#F23645]/20 text-[#F23645]'
                          : 'bg-[#8d90a2]/20 text-[#8d90a2]'
                      }`}
                    >
                      {news.sentiment}
                    </span>
                    {news.relatedSymbols.map((sym) => (
                      <span key={sym} className="text-[10px] bg-[#131722] text-[#8d90a2] px-1.5 py-0.5 rounded font-mono">
                        ${sym}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ECONOMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="p-3 space-y-3 overflow-y-auto">
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="font-headline font-bold text-sm text-white">Global Economic Releases</span>
                <span className="text-[10px] text-[#8d90a2]">EST Timezone</span>
              </div>

              {UPCOMING_ECONOMIC_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#1E222D] border border-[#363A45] rounded-xl p-3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <span>{event.flag}</span>
                      <span>{event.title}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        event.impact === 'HIGH'
                          ? 'bg-[#F23645]/20 text-[#F23645]'
                          : 'bg-amber-400/20 text-amber-400'
                      }`}
                    >
                      {event.impact}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8d90a2] font-mono pt-1">
                    <span>{event.time}</span>
                    <span>
                      Frcst: <strong className="text-white">{event.forecast}</strong> • Prev:{' '}
                      <strong className="text-[#8d90a2]">{event.previous}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="border-b border-[#363A45] pb-3">
                <div className="font-headline font-bold text-base text-white">Price Alerts Engine</div>
                <div className="text-xs text-[#8d90a2]">Instant Audio & Push Triggers</div>
              </div>

              {/* Create Alert Form */}
              <form onSubmit={handleCreateAlert} className="bg-[#1E222D] border border-[#363A45] rounded-xl p-3 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Set Alert for {selectedAsset.symbol}</span>
                  <span className="font-mono text-[#8d90a2]">${selectedAsset.price.toFixed(2)}</span>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8d90a2] mb-1">Target Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAlertPrice}
                    onChange={(e) => setNewAlertPrice(Number(e.target.value))}
                    className="w-full bg-[#131722] border border-[#363A45] focus:border-[#2962FF] rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#2962FF] hover:bg-[#1e4cd2] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Alert Trigger</span>
                </button>
              </form>

              {/* Active Alerts List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#8d90a2] uppercase tracking-wider">Active Alerts</div>
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#8d90a2]">
                    No active price alerts. Set one above!
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-[#1E222D] border border-[#363A45] rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                          <span>{alert.symbol}</span>
                          <span className="text-[10px] text-[#2962FF] bg-[#2962FF]/15 px-1.5 rounded">
                            {alert.condition} ${alert.targetPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8d90a2]">
                          Created @ ${alert.createdPrice.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="text-[#8d90a2] hover:text-[#F23645] p-1.5 rounded hover:bg-[#262A35] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

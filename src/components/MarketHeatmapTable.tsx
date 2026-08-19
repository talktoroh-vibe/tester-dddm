import React, { useState } from 'react';
import { Asset, MarketCategory } from '../types';
import { TrendingUp, TrendingDown, ArrowUpDown, ChevronRight, BarChart2 } from 'lucide-react';

interface MarketHeatmapTableProps {
  assets: Asset[];
  activeCategory: MarketCategory;
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  onOpenTrading: (asset: Asset) => void;
}

export const MarketHeatmapTable: React.FC<MarketHeatmapTableProps> = ({
  assets,
  activeCategory,
  selectedAsset,
  onSelectAsset,
  onOpenTrading,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'gainers' | 'losers' | 'volume'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'name'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter assets by active category
  let categoryAssets = assets.filter((a) => a.category === activeCategory);

  // If no direct category match, show all
  if (categoryAssets.length === 0) {
    categoryAssets = assets;
  }

  // Filter by tab
  let filtered = [...categoryAssets];
  if (filterTab === 'gainers') {
    filtered = filtered.filter((a) => a.changePercent > 0);
  } else if (filterTab === 'losers') {
    filtered = filtered.filter((a) => a.changePercent < 0);
  }

  // Sort
  filtered.sort((a, b) => {
    let diff = 0;
    if (sortBy === 'price') diff = b.price - a.price;
    else if (sortBy === 'change') diff = b.changePercent - a.changePercent;
    else if (sortBy === 'name') diff = a.name.localeCompare(b.name);
    else diff = b.changePercent - a.changePercent;
    return sortAsc ? -diff : diff;
  });

  const handleSort = (type: 'price' | 'change' | 'volume' | 'name') => {
    if (sortBy === type) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(type);
      setSortAsc(false);
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto mb-16">
      {/* Header with Category Title and Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-headline text-lg sm:text-xl font-semibold text-[#dfe2f2] flex items-center gap-2">
            <span>{activeCategory} Overview</span>
            <span className="text-xs font-mono font-normal text-[#8d90a2] bg-[#1E222D] px-2 py-0.5 rounded border border-[#363A45]">
              {filtered.length} instruments
            </span>
          </h3>
          <p className="text-xs text-[#8d90a2] mt-0.5">
            Click any asset row to inspect on the interactive chart canvas.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-[#1E222D] rounded-lg p-1 border border-[#363A45] w-fit">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterTab === 'all' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab('gainers')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              filterTab === 'gainers' ? 'bg-[#089981] text-white' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            Gainers
          </button>
          <button
            onClick={() => setFilterTab('losers')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              filterTab === 'losers' ? 'bg-[#F23645] text-white' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
          >
            <TrendingDown className="w-3 h-3" />
            Losers
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#171B26] border-b border-[#363A45] text-[11px] font-bold text-[#8d90a2] uppercase tracking-wider">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol / Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>24h Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center hidden md:table-cell">24h Range</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Volume</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">Mkt Cap / Yield</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Trend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#363A45]/40 text-xs">
              {filtered.map((item) => {
                const isSelected = selectedAsset.id === item.id;
                const isPositive = item.changePercent >= 0;

                // Calculate 24h range percent position
                const rangeDiff = item.high24h - item.low24h || 1;
                const currentPosPercent = Math.min(100, Math.max(0, ((item.price - item.low24h) / rangeDiff) * 100));

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAsset(item)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#2962FF]/10 font-medium'
                        : 'hover:bg-[#262A35]'
                    }`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: item.badgeBgColor || (isPositive ? '#089981' : '#F23645') }}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] text-white font-bold flex-shrink-0"
                        >
                          {item.badgeNumber || item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#dfe2f2] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                            {item.symbol}
                            {isSelected && (
                              <span className="text-[9px] bg-[#2962FF] text-white px-1.5 py-0.2 rounded font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8d90a2] truncate max-w-[150px] sm:max-w-[200px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-[#dfe2f2] text-sm">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 2 ? 4 : 2,
                      })}{' '}
                      <span className="text-[10px] text-[#8d90a2] font-normal">{item.currency}</span>
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-4 text-right">
                      <div
                        className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPositive
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#F23645]/15 text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </td>

                    {/* 24h Range Bar */}
                    <td className="py-3 px-4 text-center hidden md:table-cell">
                      <div className="w-32 mx-auto">
                        <div className="flex justify-between text-[10px] text-[#8d90a2] font-mono mb-1">
                          <span>{item.low24h.toFixed(2)}</span>
                          <span>{item.high24h.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#131722] rounded-full overflow-hidden relative">
                          <div
                            style={{ width: `${currentPosPercent}%` }}
                            className={`h-full ${isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'}`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-4 text-right font-mono text-[#8d90a2] hidden sm:table-cell">
                      {item.volume}
                    </td>

                    {/* Market Cap / Yield */}
                    <td className="py-3 px-4 text-right font-mono text-[#8d90a2] hidden lg:table-cell">
                      {item.marketCap || item.yield || '—'}
                    </td>

                    {/* Mini Sparkline SVG */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      <svg className="w-20 h-6 mx-auto" viewBox="0 0 80 24">
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#089981' : '#F23645'}
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={item.sparkline
                            .map((val, idx) => {
                              const min = Math.min(...item.sparkline);
                              const max = Math.max(...item.sparkline);
                              const x = (idx / (item.sparkline.length - 1)) * 76 + 2;
                              const y = 22 - ((val - min) / (max - min || 1)) * 18;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                        />
                      </svg>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(item);
                          onOpenTrading(item);
                        }}
                        className="bg-[#2962FF] hover:bg-[#1e4cd2] text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
